/**
 * Analytics utility for Recovery Compass
 * Handles event tracking with UTM parameter capture
 */

// Types for analytics events
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}

export interface PageViewEvent extends AnalyticsEvent {
  name: 'page_view';
  properties: {
    path: string;
    title?: string;
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };
}

export interface LeadEvent extends AnalyticsEvent {
  name: 'lead_captured';
  properties: {
    source: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    email?: string;
  };
}

export interface ClickEvent extends AnalyticsEvent {
  name: 'button_click' | 'link_click';
  properties: {
    element_id?: string;
    element_text?: string;
    destination?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}

/**
 * Get environment variables with type safety
 */
const getEnvVariable = (key: string): string => {
  return import.meta.env[key] || '';
};

/**
 * Get UTM parameters from URL
 */
export const getUTMParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};
  
  // Extract UTM parameters
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });
  
  return utmParams;
};

/**
 * Check if current visit is from Devansh campaign
 */
export const isDevanshCampaign = (): boolean => {
  const devanshUTM = getEnvVariable('VITE_DEVANSH_UTM');
  const currentURL = window.location.search;
  
  return currentURL.includes(devanshUTM);
};

/**
 * Track generic event
 */
export const trackEvent = (event: AnalyticsEvent): void => {
  const isProduction = getEnvVariable('VITE_ENVIRONMENT') !== 'development';
  const analyticsKey = getEnvVariable('VITE_ANALYTICS_KEY');
  
  // Add UTM parameters to event properties
  const utmParams = getUTMParams();
  const enrichedProperties = {
    ...event.properties,
    ...utmParams,
    timestamp: new Date().toISOString(),
  };
  
  // Log event in development
  if (!isProduction) {
    console.log('📊 ANALYTICS EVENT:', event.name, enrichedProperties);
    return;
  }
  
  // In production, we would send to actual analytics service
  // This is a placeholder for future implementation
  if (analyticsKey && analyticsKey !== 'placeholder_for_amplitude') {
    // Here you would implement the actual API call to your analytics service
    console.log('Analytics event sent to production service:', event.name);
  }
};

/**
 * Track page view
 */
export const trackPageView = (title?: string): void => {
  const path = window.location.pathname;
  const referrer = document.referrer;
  
  const pageViewEvent: PageViewEvent = {
    name: 'page_view',
    properties: {
      path,
      title: title || document.title,
      referrer: referrer || undefined,
    }
  };
  
  trackEvent(pageViewEvent);
};

/**
 * Track button or link click
 */
export const trackClick = (
  type: 'button_click' | 'link_click',
  elementId?: string,
  elementText?: string,
  destination?: string
): void => {
  const clickEvent: ClickEvent = {
    name: type,
    properties: {
      element_id: elementId,
      element_text: elementText,
      destination: destination,
    }
  };
  
  trackEvent(clickEvent);
};

/**
 * Track lead specifically from Devansh campaign
 */
export const trackDevanshLead = (email?: string): void => {
  const leadEvent: LeadEvent = {
    name: 'lead_captured',
    properties: {
      source: 'devansh_substack',
      email: email,
    }
  };
  
  trackEvent(leadEvent);
};

export default {
  trackEvent,
  trackPageView,
  trackClick,
  trackDevanshLead,
  isDevanshCampaign,
  getUTMParams,
};
