import React, { useState } from 'react';

const tabs = [
  { label: 'Profile', value: 'profile' },
  { label: 'Account', value: 'account' },
  { label: 'Preferences', value: 'preferences' },
  { label: 'Design', value: 'design' },
  { label: 'AI / Integrations', value: 'ai' },
];

const demoDevices = [
  { id: 1, name: 'Chrome on Windows', lastActive: 'Just now', location: 'London, UK' },
  { id: 2, name: 'Safari on iPhone', lastActive: '2h ago', location: 'New York, USA' },
];

const demoIntegrations = [
  { name: 'GitHub', enabled: true },
  { name: 'Slack', enabled: false },
  { name: 'VS Code', enabled: true },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState(demoIntegrations);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Settings</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.value}
            className={`px-4 py-2 rounded-t-lg font-medium focus:outline-none transition-colors duration-200 ${activeTab === tab.value ? 'bg-gradient-to-r from-[#8E1616] to-[#D84040] text-white' : 'bg-[#222] text-gray-300 hover:bg-[#333]'}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-[#232323] rounded-b-lg p-6 shadow-lg">
        {activeTab === 'profile' && (
          <form className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#181818] flex items-center justify-center overflow-hidden">
                {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-gray-500">No Avatar</span>}
              </div>
              <input type="file" accept="image/*" className="text-gray-300" onChange={e => {
                const file = e.target.files?.[0];
                if (file) setAvatar(URL.createObjectURL(file));
              }} />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Name</label>
              <input type="text" className="w-full px-3 py-2 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040]" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Username</label>
              <input type="text" className="w-full px-3 py-2 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040]" placeholder="@username" />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Bio</label>
              <textarea className="w-full px-3 py-2 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040]" placeholder="Short bio..." />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Social Links</label>
              <input type="url" className="w-full px-3 py-2 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040]" placeholder="https://twitter.com/yourhandle" />
            </div>
            <button type="submit" className="bg-gradient-to-r from-[#8E1616] to-[#D84040] text-white px-4 py-2 rounded">Save Profile</button>
          </form>
        )}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <form className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Change Password</label>
                <input type="password" className="w-full px-3 py-2 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040]" placeholder="New Password" />
              </div>
              <button type="submit" className="bg-gradient-to-r from-[#8E1616] to-[#D84040] text-white px-4 py-2 rounded">Update Password</button>
            </form>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Two-Factor Authentication (2FA)</span>
              <input type="checkbox" className="form-checkbox h-5 w-5 text-[#D84040]" />
            </div>
            <div>
              <h3 className="text-gray-300 font-semibold mb-2">Connected Devices</h3>
              <ul className="space-y-2">
                {demoDevices.map(device => (
                  <li key={device.id} className="flex items-center justify-between bg-[#181818] rounded px-3 py-2">
                    <span className="text-gray-300">{device.name}</span>
                    <span className="text-xs text-gray-400">{device.lastActive} • {device.location}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-[#444] pt-4 mt-4">
              <button type="button" className="text-red-400 hover:text-red-600 font-semibold">Sign Out of All Devices</button>
            </div>
          </div>
        )}
        {activeTab === 'preferences' && (
          <form className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Language</label>
              <select className="w-full px-3 py-2 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040]">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Code Theme</label>
              <select className="w-full px-3 py-2 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040]">
                <option>Monokai</option>
                <option>Dracula</option>
                <option>Solarized Dark</option>
                <option>Light</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email Notifications</span>
              <input type="checkbox" className="form-checkbox h-5 w-5 text-[#D84040]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Push Notifications</span>
              <input type="checkbox" className="form-checkbox h-5 w-5 text-[#D84040]" />
            </div>
            <button type="submit" className="bg-gradient-to-r from-[#8E1616] to-[#D84040] text-white px-4 py-2 rounded">Save Preferences</button>
          </form>
        )}
        {activeTab === 'design' && (
          <form className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">UI Theme</label>
              <select className="w-full px-3 py-2 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040]">
                <option>System</option>
                <option>Light</option>
                <option>Dark</option>
                <option>Maroon</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Font</label>
              <select className="w-full px-3 py-2 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040]">
                <option>Titillium Web</option>
                <option>Roboto</option>
                <option>Fira Code</option>
                <option>Inter</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Sidebar Position</span>
              <select className="px-2 py-1 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040]">
                <option>Left</option>
                <option>Right</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Accent Color</label>
              <input type="color" className="w-10 h-10 p-0 border-none bg-transparent" defaultValue="#8E1616" />
            </div>
            <button type="submit" className="bg-gradient-to-r from-[#8E1616] to-[#D84040] text-white px-4 py-2 rounded">Save Design</button>
          </form>
        )}
        {activeTab === 'ai' && (
          <form className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">API Key</label>
              <input type="text" className="w-full px-3 py-2 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040]" placeholder="sk-..." />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">AI Model</label>
              <select className="w-full px-3 py-2 rounded bg-[#181818] text-white border border-[#444] focus:outline-none focus:border-[#D84040]">
                <option>Groq Llama 3</option>
                <option>OpenAI GPT-4</option>
                <option>Anthropic Claude</option>
              </select>
            </div>
            <div>
              <h3 className="text-gray-300 font-semibold mb-2">Integrations</h3>
              <ul className="space-y-2">
                {integrations.map((integration, idx) => (
                  <li key={integration.name} className="flex items-center justify-between bg-[#181818] rounded px-3 py-2">
                    <span className="text-gray-300">{integration.name}</span>
                    <input
                      type="checkbox"
                      checked={integration.enabled}
                      onChange={() => setIntegrations(integrations.map((i, iidx) => iidx === idx ? { ...i, enabled: !i.enabled } : i))}
                      className="form-checkbox h-5 w-5 text-[#D84040]"
                    />
                  </li>
                ))}
              </ul>
            </div>
            <button type="submit" className="bg-gradient-to-r from-[#8E1616] to-[#D84040] text-white px-4 py-2 rounded">Save Integrations</button>
          </form>
        )}
      </div>
    </div>
  );
} 