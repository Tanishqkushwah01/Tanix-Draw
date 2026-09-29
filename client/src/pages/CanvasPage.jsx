import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import Toolbar from '../components/CanvasComponents/Toolbar';
import Canvas from '../components/CanvasComponents/Canvas';
import MenuBar from '../components/CanvasComponents/MenuBar';
import MenuPanel from '../components/CanvasComponents/MenuPanel';
import CollaborationPanel from '../components/CanvasComponents/CollaborationPanel';
import getSocket from '../components/websocket/socket';
import { getCanvasById, updateCanvasSettings } from "../components/Api/canvasApi";
import useWebNavigate from "../components/hooks/useWebNavigate";
import ConfirmModal from '../components/CanvasComponents/ConfirmModal';

const CanvasPage = () => {

  const { id } = useParams();

  const [canvas, setCanvas] = useState(null);
  const shapesRef = useRef([]);
  const [loading, setLoading] = useState(true);

  const [selectedTool, setSelectedTool] = useState("mousePointer");
  const [isToolLocked, setIsToolLocked] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [theme, setTheme] = useState("");
  const [drawingPencil, setDrawingPencil] = useState("");

  const [showMenu, setShowMenu] = useState(false);
  const [menuView, setMenuView] = useState("main");
  const menuRef = useRef(null);

  const [joinRequests, setJoinRequests] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?._id;

  const socketRef = useRef(getSocket());

  const [cursors, setCursors] = useState({});
  const cursorsBufferRef = useRef({});

  const activeTheme = theme === "black" ? "dark" : "paper";
  const isOwner = canvas?.ownerId?.toString() === userId?.toString();


  // const handleLocalCursorMove = (uid, x, y, username) => {
  //   cursorsBufferRef.current[uid] = { x, y, username };
  // };

  const { gotoDashboard } = useWebNavigate();

  const canvasRef = useRef(canvas);
  const isOwnerRef = useRef(isOwner);
  useEffect(() => { canvasRef.current = canvas; }, [canvas]);
  useEffect(() => { isOwnerRef.current = isOwner; }, [isOwner]);

  const hasNotifiedLeaveRef = useRef(false);

  const notifyLeaveIfNeeded = () => {
    if (hasNotifiedLeaveRef.current) return;

    const currentCanvas = canvasRef.current;
    if (!currentCanvas?.roomId) return;

    hasNotifiedLeaveRef.current = true;

    if (isOwnerRef.current) {

      socketRef.current?.send(
        JSON.stringify({
          type: "owner-left-canvas",
          roomId: currentCanvas.roomId,
        })
      );
    } else {

      socketRef.current?.send(
        JSON.stringify({
          type: "leave-room",
          roomId: currentCanvas.roomId,
        })
      );
    }
  };

  const handleGoToDashboard = () => {
    notifyLeaveIfNeeded();
    gotoDashboard();
  };

  
  useEffect(() => {
    return () => {
      notifyLeaveIfNeeded();
    };
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCursors({ ...cursorsBufferRef.current });
  //   }, 300);

  //   return () => clearInterval(interval);
  // }, []);

  const cursorsDirtyRef = useRef(false);

const handleLocalCursorMove = useCallback((uid, x, y, username) => {
  cursorsBufferRef.current[uid] = { x, y, username };
  cursorsDirtyRef.current = true;
}, []);

useEffect(() => {
  const interval = setInterval(() => {
    if (!cursorsDirtyRef.current) return;
    cursorsDirtyRef.current = false;
    setCursors({ ...cursorsBufferRef.current });
  }, 500);
  return () => clearInterval(interval);
}, []);



  useEffect(() => {
    const handleOutsideClick = (event) => {
      
      
      if (menuView !== "main") return;

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [menuView]);



  useEffect(() => {
    const fetchCanvas = async () => {
      try {
        setLoading(true);

        const response = await getCanvasById(id);


        if (response.data.success) {
          shapesRef.current = response.data.shapes;

          setCanvas(response.data.canvas);

          setShowGrid(response.data.canvas.showGrid);

          if (response.data.canvas.canvasTheme === "dark") {
            setTheme("black");
            setDrawingPencil("white");
          } else {
            setTheme("#F0ECE4");
            setDrawingPencil("black");
          }
        }

      } catch (error) {
        console.error("Get Canvas Error:", error);

        sessionStorage.setItem(
          "tkdraw-removed-notice",
          error.response?.status === 403
            ? "You don't have access to this canvas."
            : "Canvas not found or could not be loaded."
        );
        gotoDashboard();

      } finally {
        setLoading(false);
      }
    };

    fetchCanvas();
  }, [id]);


  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);


      if (data.type === "join-request") {
        setJoinRequests((prev) => {

          const alreadyExists = prev.some(
            (r) => r.requestId === data.requestId
          );
          if (alreadyExists) return prev;

          const newRequest = {
            requestId: data.requestId,
            userId: data.requesterId,
            name: data.requesterName || "User",
            initial: (data.requesterName || "U")[0].toUpperCase(),
            avatarColor: "bg-blue-500",
          };

          return [...prev, newRequest];
        });
      }

      if (data.type === "cursor-move") {
        cursorsBufferRef.current[data.userId] = {
          x: data.x,
          y: data.y,
          username: data.username,
        };
      }

      if (data.type === "users-list") {
        setOnlineUsers(data.users);

        const activeIds = new Set(data.users.map((u) => u.userId));

        Object.keys(cursorsBufferRef.current).forEach((id) => {
          if (!activeIds.has(id)) {
            delete cursorsBufferRef.current[id];
          }
        });
      }

      if (data.type === "room-error" && !isOwnerRef.current) {
        sessionStorage.setItem(
          "tkdraw-removed-notice",
          "You are no longer part of this canvas."
        );
        gotoDashboard();
      }

      if (data.type === "removed-from-room") {

        const noticeMessage =
          data.reason === "owner-left"
            ? "The owner has left the canvas. You've been moved to your dashboard."
            : "You were removed from the canvas by the owner.";

        sessionStorage.setItem("tkdraw-removed-notice", noticeMessage);
        gotoDashboard();
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, []);


  useEffect(() => {
    if (!canvas || !userId) return;

    const socket = socketRef.current;
    if (!socket) return;

    const isOwner = canvas.ownerId.toString() === userId.toString();

    const handleOpen = () => {
      if (isOwner) {

        socket.send(
          JSON.stringify({
            type: "join-canvas",
            roomId: canvas.roomId,
          })
        );
      } else {

        socket.send(
          JSON.stringify({
            type: "join-room",
            roomId: canvas.roomId,
          })
        );
      }
    };

    if (socket.readyState === WebSocket.OPEN) {
      handleOpen();
    }

    socket.addEventListener("open", handleOpen);

    return () => {
      socket.removeEventListener("open", handleOpen);
    };
  }, [canvas, userId]);

  const handleAccept = (request) => {
    socketRef.current?.send(
      JSON.stringify({
        type: "accept-request",
        requestId: request.requestId,
      })
    );

    setJoinRequests((prev) =>
      prev.filter((item) => item.requestId !== request.requestId)
    );
  };

  const handleChangePermission = (targetUserId, permission) => {
    socketRef.current?.send(
      JSON.stringify({
        type: "change-permission",
        roomId: canvas.roomId,
        targetUserId,
        permission,  
      })
    );
  };

  const handleRemoveUser = (targetUserId) => {
    socketRef.current?.send(
      JSON.stringify({
        type: "remove-user",
        roomId: canvas.roomId,
        targetUserId,
      })
    );
  };

  const handleCloseRoom = () => {
    if (!canvas) return;

    socketRef.current?.send(
      JSON.stringify({
        type: "close-room",
        roomId: canvas.roomId,
      })
    );
  };


  const handleReject = (request) => {
    socketRef.current?.send(
      JSON.stringify({
        type: "reject-request",
        requestId: request.requestId,
      })
    );

    setJoinRequests((prev) =>
      prev.filter((item) => item.requestId !== request.requestId)
    );
  };



  const handleClearCanvas = () => {
  if (!canvas) return;
  setShowClearConfirm(true);
};

const confirmClearCanvas = () => {
  setShowClearConfirm(false);

  socketRef.current?.send(
    JSON.stringify({
      type: "clear-canvas",
      roomId: canvas.roomId,
    })
  );
};

  const handleToggleGrid = (value) => {
    setShowGrid(value);

    if (isOwner && id) {
      updateCanvasSettings(id, { showGrid: value }).catch((error) => {
        console.error("Grid save error:", error);
      });
    }
  };

  const handleToggleTheme = (themeName) => {
    if (themeName === "dark") {
      setTheme("black");
      setDrawingPencil("white");
    } else {
      setTheme("#F0ECE4");
      setDrawingPencil("black");
    }

    if (isOwner && id) {
      updateCanvasSettings(id, { canvasTheme: themeName }).catch((error) => {
        console.error("Theme save error:", error);
      });
    }
  };



  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#f5f5f5]">

          {showClearConfirm && (
      <ConfirmModal
        title="Clear canvas?"
        message="The whole canvas will be cleared. This cannot be undone."
        confirmLabel="Clear it"
        cancelLabel="Cancel"
        danger
        onConfirm={confirmClearCanvas}
        onCancel={() => setShowClearConfirm(false)}
      />
    )}


      <div
        ref={menuRef}
        className="absolute top-0 left-0 z-30"
      >
        <MenuBar
          onClick={() => {
            setShowMenu(prev => !prev);
            setMenuView("main");
          }}
        />

        {showMenu && (
          <>
            {menuView === "main" && (
              <MenuPanel
                onCollaboration={() => {
                  setMenuView("collaboration");
                }}
                isOwner={canvas?.ownerId?.toString() === userId?.toString()}
                onClearCanvas={handleClearCanvas}
                showGrid={showGrid}
                onToggleGrid={handleToggleGrid}
                canvasTheme={activeTheme}
                onToggleTheme={handleToggleTheme}
                onGoToDashboard={handleGoToDashboard}
              />
            )}

            {menuView === "collaboration" && (
              <CollaborationPanel
                onBack={() => setMenuView("main")}
                joinRequests={joinRequests}
                onAccept={handleAccept}
                onReject={handleReject}
                onlineUsers={onlineUsers}
                onChangePermission={handleChangePermission}
                onRemoveUser={handleRemoveUser}
                onCloseRoom={handleCloseRoom}
                isOwner={canvas?.ownerId?.toString() === userId?.toString()}
                shapesRef={shapesRef}
                cursors={cursors}
                userId={userId}
              />
            )}
          </>
        )}
      </div>

      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Toolbar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          isToolLocked={isToolLocked}
          setIsToolLocked={setIsToolLocked}
          canDraw={
            canvas?.ownerId?.toString() === userId?.toString()
              ? true
              : onlineUsers.find((u) => u.userId === userId)?.permission === "editor"
          }
        />
      </div>

      {/* Canvas */}
      <Canvas
        shapesRef={shapesRef}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        isToolLocked={isToolLocked}
        showGrid={showGrid}
        theme={theme}
        drawingPencil={drawingPencil}
        canvasId={canvas?._id}
        roomId={canvas?.roomId}
        onLocalCursorMove={handleLocalCursorMove}
        canDraw={
          canvas?.ownerId?.toString() === userId?.toString()
            ? true
            : onlineUsers.find((u) => u.userId === userId)?.permission === "editor"
        }
      />


    </div>


  );
};

export default CanvasPage;