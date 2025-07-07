import React, { useState } from 'react';

const demoNotifications = [
  { id: 1, type: 'system', title: 'Welcome to SimplifyTechBits!', desc: 'Your account was created successfully.', time: '2m ago', read: false, icon: '🎉' },
  { id: 2, type: 'security', title: 'Security Alert', desc: 'Unusual login detected.', time: '10m ago', read: false, icon: '🔒' },
  { id: 3, type: 'ai', title: 'AI Code Review', desc: 'AI found 2 issues in your last commit.', time: '1h ago', read: true, icon: '🤖' },
  { id: 4, type: 'social', title: 'New Collaboration', desc: 'You were added to the "Frontend Team".', time: '3h ago', read: false, icon: '👥' },
  { id: 5, type: 'system', title: 'Update Available', desc: 'A new version is ready to install.', time: '1d ago', read: true, icon: '⬇️' },
];

const types = [
  { label: 'All', value: 'all' },
  { label: 'System', value: 'system' },
  { label: 'Security', value: 'security' },
  { label: 'AI', value: 'ai' },
  { label: 'Social', value: 'social' },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const markAllAsRead = () => setNotifications(n => n.map(notif => ({ ...notif, read: true })));
  const markAsUnread = id => setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: false } : notif));
  const markAsRead = id => setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));
  const deleteNotification = id => setNotifications(n => n.filter(notif => notif.id !== id));

  const filtered = notifications.filter(n =>
    (filter === 'all' || n.type === filter) &&
    (n.title.toLowerCase().includes(search.toLowerCase()) || n.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <div className="flex gap-2 items-center">
          <button onClick={markAllAsRead} className="text-sm text-[#D84040] hover:underline">Mark all as read</button>
          <a href="/settings" className="text-sm text-gray-400 hover:text-[#D84040] ml-2">Notification Settings</a>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {types.map(t => (
          <button
            key={t.value}
            className={`px-3 py-1 rounded-full text-xs font-medium focus:outline-none transition-colors duration-200 ${filter === t.value ? 'bg-gradient-to-r from-[#8E1616] to-[#D84040] text-white' : 'bg-[#222] text-gray-300 hover:bg-[#333]'}`}
            onClick={() => setFilter(t.value)}
          >
            {t.label}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="ml-auto px-2 py-1 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040] text-xs"
        />
      </div>
      <div className="bg-[#232323] rounded-lg p-6 shadow-lg min-h-[200px]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <span className="text-5xl mb-2">📭</span>
            <span>No notifications found. Try a different filter or search.</span>
            <span className="text-xs mt-2">Tip: Enable more notification types in <a href='/settings' className='text-[#D84040] underline'>Settings</a>.</span>
          </div>
        ) : (
          <ul className="space-y-4">
            {filtered.map(notif => (
              <li key={notif.id} className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${notif.read ? 'bg-[#181818]' : 'bg-gradient-to-r from-[#8E1616]/30 to-[#D84040]/30'}`}>
                <span className="text-2xl mt-1">{notif.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${notif.read ? 'text-gray-300' : 'text-white'}`}>{notif.title}</span>
                    <span className="text-xs text-gray-400 ml-2">{notif.time}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{notif.desc}</p>
                  <div className="flex gap-2 mt-2">
                    {!notif.read ? (
                      <button onClick={() => markAsRead(notif.id)} className="text-xs text-[#D84040] hover:underline">Mark as read</button>
                    ) : (
                      <button onClick={() => markAsUnread(notif.id)} className="text-xs text-gray-400 hover:text-[#D84040] hover:underline">Mark as unread</button>
                    )}
                    <button onClick={() => deleteNotification(notif.id)} className="text-xs text-gray-400 hover:text-red-400">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 