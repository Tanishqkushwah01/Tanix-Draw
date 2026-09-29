import { useEffect, useRef, useState } from "react";
import { PlusIcon, LinkIcon } from "../components/dashboardComponents/dashboardIcons";
import Modal from "../components/dashboardComponents/Modal";
import RoomCard from '../components/dashboardComponents/RoomCard'
import CreateRoomModal from "../components/dashboardComponents/CreateRoomModal";
import EditRoomModal from "../components/dashboardComponents/EditRoomModal";
import { createRoom, getMyCanvases, requestJoinRoom, getJoinRequestStatus, updateCanvasSettings, deleteCanvas } from "../components/Api/canvasApi";
import JoinRoomModal from "../components/dashboardComponents/JoinRoomModal";
import useWebNavigate from "../components/hooks/useWebNavigate";
import getSocket from "../components/websocket/socket";
import { logout } from "../components/Api/authApi";


const MAX_ROOMS = 12;

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [removedNotice, setRemovedNotice] = useState("");  
  const [modal, setModal] = useState(null);   
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomData, setRoomData] = useState(null);

  const [joinRoomId, setJoinRoomId] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");

  const [isJoining, setIsJoining] = useState(false);  
  const pollIntervalRef = useRef(null);

  const { gotoCanvas, gotoLogin } = useWebNavigate();

  const [cardColor, setCardColor] = useState("");

  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const colors = [
    "#f5c4be",
    "#f8e0b5",
    "#e4d6ff",
    "#ffd7b5",
    "#c8dce8",
    "#c8e8c8"

  ];

  const atLimit = rooms.length >= MAX_ROOMS;

  const fetchRooms = async () => {
    try {
      const res = await getMyCanvases();

      setRooms(res.data.canvases);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    setUserInfo(user);
    fetchRooms();
  }, []);

  useEffect(() => {
    const wasRemoved = sessionStorage.getItem("tkdraw-removed-notice");

    if (wasRemoved) {
      sessionStorage.removeItem("tkdraw-removed-notice");
      setRemovedNotice(wasRemoved);

      const timer = setTimeout(() => setRemovedNotice(""), 4000);
      return () => clearTimeout(timer);
    }
  }, []);



  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "join-request-accepted") {

        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        setIsJoining(false);
        setJoinError("");
        setModal(null);
        gotoCanvas(data.roomId);
      }

      if (data.type === "join-request-rejected") {
        setJoinError("Owner rejected your join request.");
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [gotoCanvas]);


  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []);

  const handleLogout = async () => {


    const socket = getSocket();
  socket?.disconnect();

  try {
    await logout();
  } catch (error) {
    console.error("Logout request failed:", error);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  localStorage.clear();

  gotoLogin();
};

  const handleCreate = async (data) => {
    setCreateError("");
    setIsCreating(true);

    try {
      const res = await createRoom(data);

      if (!res.data.success) {
        setCreateError(res.data.message || "Unable to create room.");
        return;
      }

      await fetchRooms();
      setRoomData(res.data.canvas);
      setRoomCreated(true);
    } catch (error) {
      setCreateError(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditSave = async (data) => {
    if (!editingRoom) return;

    try {
      const res = await updateCanvasSettings(editingRoom.roomId, data);

      if (res.data.success) {
        setRooms((prev) =>
          prev.map((r) =>
            r.roomId === editingRoom.roomId ? res.data.canvas : r
          )
        );
        setEditingRoom(null);
      }
    } catch (error) {
      console.log("Edit error:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingRoom) return;

    setIsDeleting(true);

    try {
      const res = await deleteCanvas(deletingRoom.roomId);

      if (res.data.success) {
        setRooms((prev) =>
          prev.filter((r) => r.roomId !== deletingRoom.roomId)
        );
      }
    } catch (error) {
      console.log("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setDeletingRoom(null);
    }
  };

  const handleJoin = async () => {

    if (isJoining) return;

    setJoinError("");

    if (!joinRoomId.trim()) {
      setJoinError("Please enter Room ID.");
      return;
    }

    if (!joinCode.trim()) {
      setJoinError("Please enter Join Code.");
      return;
    }

    setIsJoining(true);

    try {
      const res = await requestJoinRoom({
        roomId: joinRoomId,
        joinCode,
      });

      if (!res.data.success) {
        setJoinError(res.data.message || "Unable to send join request.");
        setIsJoining(false);
        return;
      }

      setJoinError("Join request sent. Waiting for owner...");

      const requestId = res.data.requestId;

      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await getJoinRequestStatus(requestId);

          if (statusRes.data.status === "accepted") {
            clearInterval(pollInterval);
            pollIntervalRef.current = null;
            setJoinError("");
            setIsJoining(false);
            setModal(null);
            gotoCanvas(statusRes.data.roomId);
          }

          if (statusRes.data.status === "rejected") {
            clearInterval(pollInterval);
            pollIntervalRef.current = null;
            setJoinError("Owner rejected your join request.");
            setIsJoining(false);
          }
        } catch (err) {
          clearInterval(pollInterval);
          pollIntervalRef.current = null;
          setIsJoining(false);
        }
      }, 2000);

      pollIntervalRef.current = pollInterval;

    } catch (error) {
      console.log(error);
      setJoinError(
        error.response?.data?.message ||
        "Something went wrong."
      );
      setIsJoining(false);
    }
  };



  const closeJoinModal = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setModal(null);
    setJoinRoomId("");
    setJoinCode("");
    setJoinError("");
    setIsJoining(false);
  };

  const closeCreateModal = () => {
    setModal(null);
    setCreateError("");
    setRoomCreated(false);
    setCardColor("");
  };

  return (
    <>

      {removedNotice && (
        <div
          className="
            fixed top-4 left-1/2 -translate-x-1/2 z-200
            bg-[#1f1f1f] text-white text-sm
            px-4 py-2.5 rounded-lg shadow-lg
          "
        >
          {removedNotice}
        </div>
      )}

<nav className="flex items-center justify-between px-12 h-16 border-b border-line bg-bg sticky top-0 z-100">
  <div className="flex items-center gap-2.5">
    <div className="w-8.5 h-8.5 bg-accent text-white rounded-[10px] flex items-center justify-center font-bold text-base">
      T
    </div>
    <span className="text-lg font-semibold tracking-[-0.3px]">Tanix Draw</span>
  </div>

  <div className="flex items-center gap-3">


    <div className="relative group">
      <div className="flex items-center gap-2 px-3 py-1.5 border-[1.5px] border-line rounded-full bg-card text-sm text-muted cursor-pointer select-none">
        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-[11px] font-bold">
          {userInfo?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>
        {userInfo?.username}
      </div>

      <div className="absolute left-0 right-0 top-full h-2" />

      <div
        className="
          absolute right-0 top-[calc(100%+0.5rem)] w-44
          bg-white border border-line rounded-xl shadow-lg py-1.5
          opacity-0 invisible translate-y-1
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
          transition-all duration-150 ease-out
          z-110
        "
      >
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#c0392b] bg-transparent border-none cursor-pointer rounded-lg hover:bg-[#fbeae7] transition-colors duration-150"
        >
          Logout
        </button>
      </div>
    </div>

    <button
      onClick={() => setModal("join")}
      className="flex items-center gap-1.75 border-2 border-fg bg-transparent px-4.5 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 hover:bg-bg hover:-translate-y-px"
    >
      <LinkIcon /> Join room
    </button>

    <button
      onClick={() => !atLimit && setModal("create")}
      disabled={atLimit}
      title={atLimit ? "You've reached the 12-board limit" : undefined}
      className="flex items-center gap-1.75 bg-fg text-white px-4.5 py-2.25 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all duration-200 hover:bg-[#333] hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
      <PlusIcon /> Create room
    </button>
  </div>
</nav>

      <main className="max-w-7xl mx-auto px-20 pt-14 pb-25 animate-[fadeUp_0.6s_ease_both]">


        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-sm text-accent italic mb-2">— your workspace</p>
            <h1 className="font-[Georgia,'Times_New_Roman',serif] text-[clamp(32px,4vw,52px)] font-bold leading-[1.1] tracking-[-1.2px]">
              Welcome back,{" "}
              <em className="not-italic bg-[linear-gradient(180deg,transparent_60%,#f5b8ac_60%)] px-1">
                {userInfo?.username}.
              </em>
            </h1>
          </div>
          <span className="text-[15px] text-muted font-[Georgia,serif] italic">
            {rooms.length} board{rooms.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* grid */}
        {rooms.length === 0 ? (
          <div className="text-center py-20 text-[#8a8070]">
            <p className="font-[Georgia,serif] text-2xl italic mb-4">
              No boards yet.
            </p>

            <p className="text-[15px]">
              Hit <strong className="text-fg">Create room</strong> to start your
              first sketch.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {rooms.map((room) => {
              return (
                <RoomCard
                  key={room._id}
                  room={room}
                  onClick={() => gotoCanvas(room.roomId)}
                  onEdit={(r) => setEditingRoom(r)}
                  onDelete={(r) => setDeletingRoom(r)}
                />
              );
            })}

            {atLimit && (
              <div
                className="
                  border-2 border-dashed border-fg/30 rounded-2xl
                  flex flex-col items-center justify-center text-center
                  px-6 py-10 min-h-65
                "
              >
                <p className="font-[Georgia,serif] text-lg italic text-fg/70 mb-2">
                  That's the max — 12 boards.
                </p>
                <p className="text-[13px] text-muted leading-relaxed">
                  Delete a board to make room for a new sketch.
                </p>
              </div>
            )}
          </div>
        )}

      </main>

      {modal === "create" && (
        <Modal
          cardColor={cardColor}
          setCardColor={setCardColor}
          colors={colors}
          onClose={closeCreateModal}>

          <CreateRoomModal
            cardColor={cardColor}
            setCardColor={setCardColor}
            colors={colors}
            setRoomCreated={setRoomCreated}

            onClose={closeCreateModal}
            onCreate={(data) => {
              handleCreate(data);
            }}

            roomCreated={roomCreated}
            roomData={roomData}
            error={createError}
            isCreating={isCreating}
          />
        </Modal>
      )}

      {modal === "join" && (
        <Modal
          onClose={closeJoinModal}
        >
          <JoinRoomModal
            onClose={closeJoinModal}
            joinRoomId={joinRoomId}
            setJoinRoomId={setJoinRoomId}
            joinCode={joinCode}
            setJoinCode={setJoinCode}
            joinError={joinError}
            handleJoin={handleJoin}
            isJoining={isJoining}
          />
        </Modal>
      )}

      {editingRoom && (
        <Modal
          cardColor={editingRoom.cardColor}
          colors={colors}
          onClose={() => setEditingRoom(null)}
        >
          <EditRoomModal
            room={editingRoom}
            colors={colors}
            onClose={() => setEditingRoom(null)}
            onSave={handleEditSave}
          />
        </Modal>
      )}

      {deletingRoom && (
        <Modal onClose={() => setDeletingRoom(null)}>
          <div className="w-full max-w-85">
            <h2 className="font-[Georgia,serif] text-xl font-bold mb-2">
              Delete "{deletingRoom.title}"?
            </h2>
            <p className="text-sm text-muted mb-6">
              Ye action undo nahi ho sakta. Board aur uske saare shapes permanently delete ho jayenge.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingRoom(null)}
                className="flex-1 border-2 border-fg rounded-lg py-2.5 text-sm font-semibold cursor-pointer hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-accent text-white rounded-lg py-2.5 text-sm font-semibold cursor-pointer hover:bg-[#c05a44] transition-colors disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Dashboard;