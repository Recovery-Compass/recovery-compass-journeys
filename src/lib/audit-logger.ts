// src/lib/audit-logger.ts
// Client-side audit logging helper (no secrets required)

interface AuditLogEvent {
  event: string;
  payload?: Record<string, any>;
  source?: string;
}

export async function logAuditEvent(event: AuditLogEvent): Promise<void> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                        import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (!supabaseUrl) {
      console.warn('Audit logging skipped: Supabase URL not configured');
      return;
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/access_logs`, {
      method: 'POST',
      headers: { 
        'content-type': 'application/json' 
      },
      body: JSON.stringify({
        event: event.event,
        payload: event.payload || {},
        source: event.source || 'web',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    });

    if (!response.ok) {
      console.warn('Audit log failed:', response.status);
    }
  } catch (error) {
    // Fail silently - audit logging should not break the app
    console.warn('Audit logging error:', error);
  }
}

// Example usage:
// await logAuditEvent({ 
//   event: 'ASSESSMENT_COMPLETED', 
//   payload: { score: 85, archetype: 'Steady Builder' } 
// });
