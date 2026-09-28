import React, { useState } from 'react';
import { EnterpriseSecurityState, SecurityAuditLog } from '../types';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Users,
  FileText,
  CheckCircle2,
  AlertOctagon,
  Eye,
  Server,
  Smartphone,
  ShieldAlert,
  Database
} from 'lucide-react';

interface EnterpriseSecuritySuiteProps {
  securityState?: EnterpriseSecurityState;
}

const DEFAULT_SECURITY_STATE: EnterpriseSecurityState = {
  mfaEnabled: true,
  roleBasedAccessActive: true,
  apiKeyEncryptionStatus: 'AES-256-GCM Encrypted (Server-side)',
  tokenStorageMode: 'Encrypted Server Session (No Frontend Plaintext)',
  workspaceIsolationActive: true,
  auditLogs: [
    {
      id: 'log_1',
      timestamp: 'Today at 05:42 AM',
      userEmail: 'visitabel4real@yahoo.com',
      action: 'OAuth 2.0 Token Exchange for Meta Graph API',
      ipAddress: '197.210.65.12',
      riskLevel: 'low',
      status: 'allowed'
    },
    {
      id: 'log_2',
      timestamp: 'Today at 03:15 AM',
      userEmail: 'sarah.chen@auracast.ai',
      action: 'API Key Rotated for Gemini 2.5 Flash',
      ipAddress: '86.154.21.90',
      riskLevel: 'medium',
      status: 'allowed'
    },
    {
      id: 'log_3',
      timestamp: 'Yesterday at 11:20 PM',
      userEmail: 'marcus.vance@auracast.ai',
      action: 'Workspace Access Granted: Team Admin',
      ipAddress: '104.28.212.80',
      riskLevel: 'low',
      status: 'allowed'
    }
  ]
};

export default function EnterpriseSecuritySuite({
  securityState = DEFAULT_SECURITY_STATE
}: EnterpriseSecuritySuiteProps) {
  const data = securityState || DEFAULT_SECURITY_STATE;

  const [mfa, setMfa] = useState(data.mfaEnabled);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Enterprise Security, Encryption & Compliance Vault
              </h2>
              <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                SOC2 Type II Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Encrypted API keys, server-side OAuth token storage, RBAC controls, MFA verification, and immutable audit logging.
            </p>
          </div>
        </div>
      </div>

      {/* SECURITY CONTROLS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CONTROL 1: TOKEN & KEY ENCRYPTION */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-600" />
              Token & Secret Encryption
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="text-xs font-mono text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-[10px] text-slate-500 uppercase">Algorithm</div>
            <div className="text-blue-700 font-bold">{data.apiKeyEncryptionStatus}</div>
          </div>

          <p className="text-xs font-sans text-slate-600">
            Social API access tokens are encrypted server-side in secure vault storage. Zero plaintext tokens on client-side frontend code.
          </p>
        </div>

        {/* CONTROL 2: MULTI-FACTOR AUTH & RBAC */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              Role-Based Access (RBAC)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-xs font-mono shadow-2xs">
            <span className="text-slate-800 font-semibold">Enforce 2FA / MFA</span>
            <button
              onClick={() => setMfa(!mfa)}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                mfa ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {mfa ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <p className="text-xs font-sans text-slate-600">
            Strict permissions across Owner, Admin, Manager, Content Creator, and Reviewer roles with workspace isolation.
          </p>
        </div>

        {/* CONTROL 3: WORKSPACE ISOLATION */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-blue-600" />
              Tenant & Data Isolation
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="text-xs font-mono text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
            <div className="text-[10px] text-slate-500 uppercase">Tenant Isolation</div>
            <div className="text-emerald-700 font-bold">Encrypted Multi-Tenant Firestore Rules</div>
          </div>

          <p className="text-xs font-sans text-slate-600">
            Each organization operates within a segregated data sandbox with custom Firebase Firestore security rules.
          </p>
        </div>
      </div>

      {/* IMMUTABLE AUDIT LOGS */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-semibold text-slate-900 uppercase">
              Immutable Enterprise Security Audit Log
            </h3>
          </div>

          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-semibold">
            Live Compliance Stream
          </span>
        </div>

        <div className="space-y-2">
          {data.auditLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-mono shadow-2xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-blue-700 font-bold">{log.userEmail}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-800">{log.action}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  IP: {log.ipAddress} | Time: {log.timestamp}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                  {log.status}
                </span>
                <span className="text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded uppercase">
                  Risk: {log.riskLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
