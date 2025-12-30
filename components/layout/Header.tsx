
import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';
import UserProfileMenu from './UserProfileMenu';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
    userEmail: string;
    userName?: string;
    userProfilePic?: string | null;
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    userEmail,
    userName,
    userProfilePic,
    onLogout = () => { }
}) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const displayName = userName || userEmail.split('@')[0];
    const hasUnreadNotifications = true; // TODO: Connect to real notification state

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-emerald-100 flex items-center justify-between px-10 z-20 sticky top-0">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50" size={18} />
                <input
                    type="text"
                    placeholder="Search loans, borrowers, or filings..."
                    className="w-full pl-12 pr-6 py-2.5 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl text-sm focus:ring-2 focus:ring-[#008751] focus:bg-white outline-none transition-all placeholder:text-emerald-900/30"
                />
            </div>

            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2.5 text-emerald-900/60 hover:bg-emerald-50 rounded-xl transition-all hover:scale-105 active:scale-95"
                    >
                        <Bell size={20} />
                        {hasUnreadNotifications && (
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>

                    <NotificationPanel
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>

                <div className="h-10 w-px bg-emerald-100/80 mx-1"></div>

                {/* User Profile */}
                <div className="relative">
                    <div
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-4 cursor-pointer group"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-emerald-950 group-hover:text-[#008751] transition-colors">
                                {displayName}
                            </p>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                                DocGuard Professional
                            </p>
                        </div>
                        <UserAvatar
                            src={userProfilePic}
                            name={displayName}
                            email={userEmail}
                            size="md"
                            showOnlineIndicator={true}
                        />
                    </div>

                    <UserProfileMenu
                        isOpen={showProfileMenu}
                        onClose={() => setShowProfileMenu(false)}
                        userName={displayName}
                        userEmail={userEmail}
                        onLogout={onLogout}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
