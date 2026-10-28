'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
  Grid,
  CheckCircle2,
  Plug,
  ExternalLink,
  ShieldCheck,
  Zap,
  Truck,
  MessageSquare,
  BarChart3,
  X,
  Loader2,
  Lock,
  Search,
} from 'lucide-react';

export default function AdminIntegrationsPage() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeApp, setActiveApp] = useState<any>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adminIntegrations'],
    queryFn: () => fetchApi('/integrations'),
  });

  const saveMutation = useMutation({
    mutationFn: async ({ key, creds }: any) => {
      return fetchApi(`/integrations/${key}`, {
        method: 'POST',
        body: JSON.stringify({ credentials: creds }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminIntegrations'] });
      setActiveApp(null);
      alert('Integration connected and credentials encrypted safely.');
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (key: string) => {
      return fetchApi(`/integrations/${key}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminIntegrations'] });
    },
  });

  const apps = data?.data || [];
  const filteredApps = apps.filter((app: any) =>
    selectedCategory === 'all' ? true : app.category === selectedCategory
  );

  const handleTestConnection = async (key: string) => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetchApi(`/integrations/${key}/test`, {
        method: 'POST',
      });
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || 'Connection test failed.' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Apps and integrations</h1>
          <p className="text-xs text-[#616161] mt-0.5">
            Connect payment gateways, shipping providers, analytics, and marketing tools.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-[0_1px_0_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Category Tabs */}
        <div className="border-b border-[#e1e3e5] px-4 flex items-center gap-6 text-xs font-semibold overflow-x-auto">
          {['all', 'payments', 'shipping', 'marketing', 'analytics', 'communication'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-3 border-b-2 capitalize transition ${
                selectedCategory === cat
                  ? 'border-[#1a1a1a] text-[#1a1a1a]'
                  : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
              }`}
            >
              {cat === 'all' ? 'All installed & available' : cat}
            </button>
          ))}
        </div>

        {/* Grid of Apps */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-2 py-12 text-center text-[#8c9196]">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#008060]" />
              Loading catalog...
            </div>
          ) : (
            filteredApps.map((app: any) => (
              <div
                key={app.key}
                className="p-5 rounded-xl border border-[#e1e3e5] hover:border-[#c9cccf] transition bg-white flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#f6f6f7] border border-[#e1e3e5] p-2 flex items-center justify-center flex-shrink-0">
                    <img src={app.logo} alt={app.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs text-[#1a1a1a]">{app.name}</h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          app.is_connected
                            ? 'bg-[#e3f1df] text-[#0d5921] border-[#aee9d1]'
                            : 'bg-[#f6f6f7] text-[#616161] border-[#e1e3e5]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            app.is_connected ? 'bg-[#008060]' : 'bg-[#8c9196]'
                          }`}
                        />
                        {app.is_connected ? 'Connected' : 'Available'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#616161] mt-1 leading-relaxed">
                      {app.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#f1f2f4]">
                  <span className="text-[10px] font-bold text-[#8c9196] uppercase tracking-wider">
                    {app.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {app.is_connected && (
                      <button
                        onClick={() => handleTestConnection(app.key)}
                        disabled={testing}
                        className="px-2.5 py-1 text-xs text-[#008060] hover:bg-[#e3f1df] rounded-lg font-semibold transition"
                      >
                        Test
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setActiveApp(app);
                        setCredentials({});
                        setTestResult(null);
                      }}
                      className="px-3 py-1 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      {app.is_connected ? 'Manage' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Configuration Modal */}
      {activeApp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e1e3e5] shadow-xl max-w-lg w-full p-6 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-[#e1e3e5] pb-3">
              <div className="flex items-center gap-2.5">
                <img src={activeApp.logo} alt="" className="w-6 h-6 object-contain" />
                <h3 className="text-sm font-bold text-[#1a1a1a]">Configure {activeApp.name}</h3>
              </div>
              <button onClick={() => setActiveApp(null)} className="text-[#616161] hover:text-[#1a1a1a]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[#616161] leading-relaxed">
              {activeApp.description} Credentials will be securely encrypted in MongoDB using AES-256-CBC.
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg text-xs font-semibold ${
                  testResult.success
                    ? 'bg-[#e3f1df] text-[#0d5921] border border-[#aee9d1]'
                    : 'bg-[#fff4f2] text-[#8c1e0b] border border-[#fedad4]'
                }`}
              >
                {testResult.message}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate({ key: activeApp.key, creds: credentials });
              }}
              className="space-y-3 text-xs"
            >
              {(activeApp.fields || []).map((f: any) => (
                <div key={f.key}>
                  <label className="block font-semibold text-[#1a1a1a] mb-1">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    required={f.required}
                    placeholder={f.placeholder || ''}
                    value={credentials[f.key] || ''}
                    onChange={(e) =>
                      setCredentials({ ...credentials, [f.key]: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-[#c9cccf] rounded-lg font-mono focus:outline-none focus:border-[#008060]"
                  />
                </div>
              ))}

              <div className="flex justify-between items-center pt-3 border-t border-[#e1e3e5]">
                {activeApp.is_connected ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Disconnect ${activeApp.name}?`)) {
                        disconnectMutation.mutate(activeApp.key);
                        setActiveApp(null);
                      }
                    }}
                    className="text-xs text-[#d72c0d] hover:underline font-semibold"
                  >
                    Disconnect app
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveApp(null)}
                    className="px-3 py-1.5 bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    {saveMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save credentials
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
