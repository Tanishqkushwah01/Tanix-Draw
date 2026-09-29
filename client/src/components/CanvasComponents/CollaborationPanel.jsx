import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  Pencil,
  Check,
  X,
  UserX,
} from "lucide-react";
import MiniMap from "./MiniMap";

const Collaboration = ({
  onBack,
  onlineUsers = [],
  joinRequests = [],
  onAccept,
  onReject,
  onChangePermission,
  onRemoveUser,
  onCloseRoom,
  isOwner,
  shapesRef,
  cursors,
  userId,
}) => {

  const [confirmingClose, setConfirmingClose] = useState(false);

  return (
    <div
      className="
    absolute
    top-17
    left-5
    z-40
    w-60
    max-h-[calc(100vh-90px)]
    bg-[#fcfcfc]
    text-[#1f1f1f]
    rounded-xl
    shadow-[0_8px_25px_rgba(0,0,0,0.18)]
    p-3
    overflow-hidden
  "
    >


      <div className="flex items-center gap-3 mb-3">

        <button
          onClick={onBack}
          className=" 
            w-7 
            h-7 
            flex 
            items-center 
            justify-center 
            rounded-md 
            hover:bg-white/10 
            transition 
            cursor-pointer 
          "
        >
          <ArrowLeft size={19} />
        </button>

        <h2 className="text-[15px] font-semibold flex-1">
          Collaboration
        </h2>

        {isOwner && !confirmingClose && (
          <button
            onClick={() => setConfirmingClose(true)}
            title="Sabhi collaborators ko canvas se hata do"
            className="
              text-[9px]
              text-red-500
              border
              border-red-300
              rounded-md
              px-2
              py-1
              hover:bg-red-50
              cursor-pointer
              whitespace-nowrap
            "
          >
            Close room
          </button>
        )}

      </div>

      {isOwner && confirmingClose && (
        <div
          className="
            flex
            items-center
            justify-between
            gap-2
            bg-red-50
            border
            border-red-200
            rounded-lg
            px-2.5
            py-2
            mb-3
          "
        >
          <span className="text-[10px] text-red-600 leading-tight">
            Close room for everyone?
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setConfirmingClose(false)}
              className="
                text-[9px]
                text-gray-500
                border
                border-gray-300
                rounded-md
                px-2
                py-1
                hover:bg-gray-100
                cursor-pointer
                whitespace-nowrap
              "
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onCloseRoom?.();
                setConfirmingClose(false);
              }}
              className="
                text-[9px]
                text-white
                bg-red-500
                rounded-md
                px-2
                py-1
                hover:bg-red-600
                cursor-pointer
                whitespace-nowrap
              "
            >
              Yes, close
            </button>
          </div>
        </div>
      )}



      <div>

        <div className="flex items-center gap-2 mb-3">

          <span className="w-2 h-2 rounded-full bg-green-500" />

          <span className="text-[12px] font-medium">
            Online Users ({onlineUsers.length})
          </span>

        </div>



        <div
          className=" 
            max-h-45 
            overflow-y-auto 
            pr-1 
            space-y-1 
 
            [&::-webkit-scrollbar]:w-1 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-white/20 
            [&::-webkit-scrollbar-thumb]:rounded-full 
          "
        >

          {onlineUsers.length === 0 ? (

            <p className="text-[11px] text-gray-500 py-2">
              No users online
            </p>

          ) : (

            onlineUsers.map((user) => (

              <div
                key={user.userId}
                className=" 
                  flex 
                  items-center 
                  justify-between 
                  py-1.5 
                "
              >


                <div className="flex items-center gap-2">

                  <div
                    className={` 
                      w-6 
                      h-6 
                      rounded-full 
                      flex 
                      items-center 
                      justify-center 
                      text-[10px] 
                      font-medium 
                      ${user.avatarColor || "bg-purple-500"} 
                    `}
                  >
                    {(user.username || "U")[0].toUpperCase()}
                  </div>

                  <span className="text-[11px]">
                    {user.username || "User"}
                  </span>

                </div>


                <div className="flex items-center gap-1.5">


                  {user.permission === "owner" && (
                    <div className="relative group">
                      <span className="text-[12px] cursor-pointer">👑</span>

                      <span
                        className="
                          absolute right-full top-1/2 -translate-y-1/2 mr-2
                          bg-[#1f1f1f] text-white text-[9px]
                          px-2 py-1 rounded-md whitespace-nowrap
                          opacity-0 group-hover:opacity-100
                          pointer-events-none transition
                          z-50
                        "
                      >
                        King
                      </span>
                    </div>
                  )}


                  {user.permission !== "owner" && (
                    <div className="relative group">
                      {isOwner ? (
                        <button
                          onClick={() =>
                            onChangePermission?.(
                              user.userId,
                              user.permission === "editor" ? "viewer" : "editor"
                            )
                          }
                          className="
                            flex items-center gap-1
                            text-gray-300
                            text-[9px]
                            bg-transparent
                            border-none
                            cursor-pointer
                            px-1 py-0.5
                            rounded
                            hover:bg-white/10
                          "
                        >
                          {user.permission === "editor" ? (
                            <Pencil size={12} />
                          ) : (
                            <Eye size={12} />
                          )}
                          {user.permission === "editor" ? "Editor" : "Viewer"}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-300 text-[9px]">
                          {user.permission === "editor" ? (
                            <Pencil size={12} />
                          ) : (
                            <Eye size={12} />
                          )}
                          {user.permission === "editor" ? "Editor" : "Viewer"}
                        </div>
                      )}

                      <span
                        className="
                          absolute bottom-full right-0 mb-1
                          bg-[#1f1f1f] text-white text-[9px]
                          px-2 py-1 rounded-md whitespace-nowrap
                          opacity-0 group-hover:opacity-100
                          pointer-events-none transition
                          z-50
                        "
                      >
                        {isOwner
                          ? user.permission === "editor"
                            ? "Click to make viewer"
                            : "Click to make editor"
                          : user.permission === "editor"
                            ? "Editor"
                            : "Viewer"}
                      </span>
                    </div>
                  )}


                  {isOwner && user.permission !== "owner" && (
                    <div className="relative group">
                      <button
                        onClick={() => onRemoveUser?.(user.userId)}
                        className="
                          w-5 h-5
                          flex items-center justify-center
                          rounded
                          text-red-400
                          hover:bg-red-500/10
                          cursor-pointer
                        "
                      >
                        <UserX size={14} />
                      </button>

                      <span
                        className="
                          absolute bottom-full right-0 mb-1
                          bg-[#1f1f1f] text-white text-[9px]
                          px-2 py-1 rounded-md whitespace-nowrap
                          opacity-0 group-hover:opacity-100
                          pointer-events-none transition
                          z-50
                        "
                      >
                        Remove user
                      </span>
                    </div>
                  )}

                </div>

              </div>

            ))

          )}

        </div>

      </div>



      <div className="h-px bg-white/10 my-4" />



      <div>

        <div className="flex items-center gap-2 mb-3">

          <span className="w-2 h-2 rounded-full bg-red-500" />

          <span className="text-[12px] font-medium">
            Join Requests ({joinRequests.length})
          </span>

        </div>



        <div
          className=" 
            max-h-47.5 
            overflow-y-auto 
            pr-1 
            space-y-2 
 
            [&::-webkit-scrollbar]:w-1 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-white/20 
            [&::-webkit-scrollbar-thumb]:rounded-full 
          "
        >

          {joinRequests.length === 0 ? (

            <p className="text-[11px] text-gray-500 py-2">
              No pending requests
            </p>

          ) : (

            joinRequests.map((request) => (

              <div
                key={request.requestId}
                className=" 
                  bg-white/5 
                  border 
                  border-white/10 
                  rounded-lg 
                  p-2.5 
                "
              >


                <div className="flex items-center gap-2 mb-3">

                  <div
                    className={` 
                      w-6 
                      h-6 
                      rounded-full 
                      flex 
                      items-center 
                      justify-center 
                      text-[10px] 
                      font-medium 
                      ${request.avatarColor || "bg-blue-500"} 
                    `}
                  >
                    {request.initial}
                  </div>


                  <div>

                    <p className="text-[11px] font-medium">
                      {request.name}
                    </p>

                    <p className="text-[9px] text-gray-400">
                      Wants to join your canvas
                    </p>

                  </div>

                </div>



                <div className="flex gap-2">

                  <button
                    onClick={() => onAccept?.(request)}
                    className=" 
                      flex-1 
                      flex 
                      items-center 
                      justify-center 
                      gap-1 
                      bg-green-500 
                      hover:bg-green-600 
                      rounded-md 
                      py-1.5 
                      text-[10px] 
                      font-medium 
                      transition 
                      cursor-pointer 
                    "
                  >
                    <Check size={12} />
                    Accept
                  </button>


                  <button
                    onClick={() => onReject?.(request)}
                    className=" 
                      flex-1 
                      flex 
                      items-center 
                      justify-center 
                      gap-1 
                      bg-red-500 
                      hover:bg-red-600 
                      rounded-md 
                      py-1.5 
                      text-[10px] 
                      font-medium 
                      transition 
                      cursor-pointer 
                    "
                  >
                    <X size={12} />
                    Reject
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>



      <div className="mt-4">

        <div className="h-px bg-white/10 mb-3" />

        <p className="text-[11px] font-medium mb-2">
          Mini Map
        </p>


        <MiniMap
          shapesRef={shapesRef}
          cursors={cursors}
          userId={userId}
        />

      </div>

    </div>
  );
};

export default Collaboration;