import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Mail, 
  Users, 
  CreditCard,
  Globe,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false
  });
  const [theme, setTheme] = useState('light');

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'advanced', label: 'Advanced', icon: Globe }
  ];

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          PA
        </div>
        <div>
          <button className="px-4 py-2 text-sm text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50">
            Change Photo
          </button>
          <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            defaultValue="PAGAdmin"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            defaultValue=""
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            defaultValue="admin@panafric.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            defaultValue=""
            placeholder="+1 (555) 123-4567"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            rows="3"
            placeholder="Tell us about yourself..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {key === 'sms' ? 'SMS' : key} Notifications
                </label>
                <p className="text-sm text-gray-500">
                  {key === 'email' && 'Receive notifications via email'}
                  {key === 'push' && 'Receive push notifications in browser'}
                  {key === 'sms' && 'Receive SMS notifications'}
                  {key === 'marketing' && 'Receive marketing and promotional emails'}
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Enable 2FA</p>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <button className="px-4 py-2 text-sm text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50">
            Setup
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          {['light', 'dark', 'auto'].map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => setTheme(themeOption)}
              className={`p-4 border-2 rounded-lg text-center capitalize ${
                theme === themeOption
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-full h-20 rounded mb-2 ${
                themeOption === 'light' ? 'bg-white border' :
                themeOption === 'dark' ? 'bg-gray-800' :
                'bg-gradient-to-r from-white to-gray-800'
              }`} />
              {themeOption}
              {theme === themeOption && <Check className="h-4 w-4 text-orange-500 mx-auto mt-1" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Apps</h3>
        <div className="space-y-4">
          {[
            { name: 'Google Workspace', status: 'Connected', icon: '🔗' },
            { name: 'Slack', status: 'Disconnected', icon: '💬' },
            { name: 'Salesforce', status: 'Connected', icon: '☁️' },
            { name: 'Mailchimp', status: 'Disconnected', icon: '📧' }
          ].map((app) => (
            <div key={app.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{app.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{app.name}</p>
                  <p className={`text-sm ${
                    app.status === 'Connected' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {app.status}
                  </p>
                </div>
              </div>
              <button className={`px-4 py-2 text-sm rounded-md ${
                app.status === 'Connected'
                  ? 'text-red-600 border border-red-300 hover:bg-red-50'
                  : 'text-orange-600 border border-orange-300 hover:bg-orange-50'
              }`}>
                {app.status === 'Connected' ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Download className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Export Data</p>
                <p className="text-sm text-gray-500">Download all your CRM data</p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50">
              Export
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Upload className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Import Data</p>
                <p className="text-sm text-gray-500">Upload data from CSV or other CRM</p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50">
              Import
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trash2 className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-red-900">Delete Account</p>
                <p className="text-sm text-red-700">Permanently delete your account and all data</p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'security': return renderSecurityTab();
      case 'appearance': return renderAppearanceTab();
      case 'integrations': return renderIntegrationsTab();
      case 'team': return <div className="text-center py-12 text-gray-500">Team management coming soon...</div>;
      case 'billing': return <div className="text-center py-12 text-gray-500">Billing settings coming soon...</div>;
      case 'advanced': return renderAdvancedTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation (simplified version) */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Panafric</p>
              <p className="text-xs text-gray-500">MTMS</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          <div className="space-y-1">
            {settingsTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account preferences and configurations</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                {renderTabContent()}
              </div>
              
              {/* Save Button */}
              <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg">
                <div className="flex justify-end space-x-3">
                  <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="px-4 py-2 text-sm text-white bg-orange-500 rounded-md hover:bg-orange-600 flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;