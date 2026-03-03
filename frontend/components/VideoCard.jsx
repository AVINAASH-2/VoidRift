import Link from 'next/link';
import { formatDistanceToNow } from "date-fns";

const VideoCard = ({ video }) => {
    // Determine the link destination (video ID or fallback)
    const videoId = video?._id;
    const linkHref = videoId ? `/watch/${videoId}` : '#';

    // Format date if available
    let timeAgo = 'Just now';
    if (video?.createdAt) {
        try {
            timeAgo = formatDistanceToNow(new Date(video.createdAt), { addSuffix: true });
        } catch (e) {
            console.error("Invalid date:", video.createdAt);
        }
    }

    return (
        <Link href={linkHref} className="flex flex-col gap-3 cursor-pointer group p-3 rounded-2xl hover:bg-white/5 transition-all duration-500 relative overflow-hidden">
            {/* Hover Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

            {/* Border Glow */}
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary/30 transition-colors duration-500 pointer-events-none box-glow opacity-0 group-hover:opacity-100" />

            {/* Thumbnail Container */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0A0A0F] shadow-lg group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-500 z-10 border border-white/5">
                {video?.thumbnailUrl ? (
                    <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="object-cover w-full h-full group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 bg-white/5">
                        <span className="text-xs uppercase tracking-widest font-mono">No Signal</span>
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                {/* Duration Badge (Mock) */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 text-primary text-[10px] font-mono font-bold rounded">
                    12:45
                </div>

                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                        <svg className="w-5 h-5 text-white fill-current ml-1" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Meta Data */}
            <div className="flex gap-3 px-1 relative z-10">
                {/* Avatar */}
                <div className="relative shrink-0 pt-1">
                    <div className="w-9 h-9 rounded-full bg-gray-800 overflow-hidden ring-1 ring-white/10 group-hover:ring-secondary/50 transition-all duration-300 shadow-md">
                        <img
                            src={video?.uploader?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video?.uploader?.username || 'user'}`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Text Info */}
                <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-lg text-gray-100 leading-tight line-clamp-2 group-hover:text-primary group-hover:text-glow transition-all duration-300">
                        {video?.title || 'Untitled Transmission'}
                    </h3>
                    <div className="mt-1.5 flex flex-col gap-0.5">
                        <p className="text-xs text-secondary/80 font-medium hover:text-secondary transition-colors truncate tracking-wide">
                            {video?.uploader?.username || 'Unknown Agent'}
                        </p>
                        <div className="flex text-[11px] text-gray-500 items-center gap-1.5 font-mono">
                            <span>{video?.views || 0} VIEWS</span>
                            <span className="text-primary/50">•</span>
                            <span>{timeAgo}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VideoCard;
