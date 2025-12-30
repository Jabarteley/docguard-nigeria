import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, Clock } from 'lucide-react';

export interface NotificationItemData {
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    link?: string;
}

interface NotificationItemProps {
    notification: NotificationItemData;
    onClick: (notification: NotificationItemData) => void;
    onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onClick,
    onMarkAsRead
}) => {
    const iconConfig = {
        success: { icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-600' },
        warning: { icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-600' },
        error: { icon: XCircle, bg: 'bg-rose-50', text: 'text-rose-600' },
        info: { icon: Info, bg: 'bg-blue-50', text: 'text-blue-600' }
    };

    const config = iconConfig[notification.type];
    const Icon = config.icon;

    const getRelativeTime = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div
            onClick={() => onClick(notification)}
            className={`p-3 rounded-xl border cursor-pointer group transition-all ${notification.read
                    ? 'bg-white border-emerald-50 hover:bg-emerald-50/50'
                    : `${config.bg} border-emerald-100 hover:bg-emerald-50`
                }`}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 ${config.bg} rounded-lg shrink-0`}>
                    <Icon size={16} className={config.text} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs font-bold text-emerald-900 ${!notification.read ? 'font-black' : ''}`}>
                            {notification.title}
                        </p>
                        {!notification.read && (
                            <span className="w-2 h-2 bg-[#008751] rounded-full shrink-0 mt-1"></span>
                        )}
                    </div>
                    <p className="text-[10px] text-emerald-600/70 mt-1 line-clamp-2">
                        {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <Clock size={10} className="text-emerald-400" />
                        <span className="text-[9px] text-emerald-500 font-medium">
                            {getRelativeTime(notification.timestamp)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;
