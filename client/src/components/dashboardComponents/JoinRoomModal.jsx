import { XIcon, LinkIcon } from "./dashboardIcons";

export default function JoinRoomModal({
  onClose,
  joinRoomId,
  setJoinRoomId,
  joinCode,
  setJoinCode,
  handleJoin,
  joinError,
  isJoining,
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-[Georgia,serif] text-2xl font-bold tracking-[-0.5px]">
          Join a room
        </h2>

        <button
          onClick={onClose}
          className="bg-transparent border-none cursor-pointer text-muted p-1"
        >
          <XIcon />
        </button>
      </div>

      <p className="text-[15px] text-muted mb-8 leading-[1.55]">
        Enter the Room ID and Join Code shared by your collaborator.
      </p>

      {/* Room ID */}
      <label className="block text-[13px] font-semibold text-muted mb-2 tracking-[0.04em]">
        ROOM ID
      </label>

      <input
        value={joinRoomId}
        onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
        placeholder="e.g. A7K9P2"
        maxLength={6}
        className="w-full px-4 py-3 text-[15px] border-2 border-fg rounded-[10px] bg-white font-inherit mb-5 outline-none focus:border-accent"
      />

      {/* Join Code */}
      <label className="block text-[13px] font-semibold text-muted mb-2 tracking-[0.04em]">
        JOIN CODE
      </label>

      <input
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
        placeholder="e.g. X4M8QW"
        maxLength={6}
        className="w-full px-4 py-3 text-[15px] border-2 border-fg rounded-[10px] bg-white font-inherit mb-5 outline-none focus:border-accent"
      />

      {joinError && (
        <p className="text-center text-[13px] text-accent italic font-[Georgia,serif] mb-4">
          {joinError}
        </p>
      )}

      <button
        onClick={handleJoin}
        disabled={isJoining}
        className="w-full bg-fg text-white border-none rounded-[10px] py-3.5 text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#333] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        <LinkIcon />
        {isJoining ? "Sending..." : "Join Room"}
      </button>
    </>
  );
}