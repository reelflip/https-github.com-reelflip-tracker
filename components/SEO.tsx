import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  path?: string;
  schema?: Record<string, any>;
}

const SEO: React.FC<SEOProps> = ({ title, description, image, path, schema }) => {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = `${title} | IITGEEPrep`;
    document.title = fullTitle;

    // 2. Update Meta Description
    const updateMeta = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    };

    // 3. Update Open Graph / Twitter
    const updateProperty = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateProperty('og:title', fullTitle);
    updateProperty('og:description', description);
    updateProperty('twitter:title', fullTitle);
    updateProperty('twitter:description', description);

    if (image) {
        updateProperty('og:image', image);
        updateProperty('twitter:image', image);
    }

    // 4. Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    const currentUrl = path ? `https://iitgeeprep.com/${path}` : window.location.href;
    canonical.setAttribute('href', currentUrl);

    // 5. Inject Structured Data (Schema.org)
    if (schema) {
        let script = document.querySelector('#dynamic-schema');
        if (!script) {
            script = document.createElement('script');
            script.setAttribute('type', 'application/ld+json');
            script.id = 'dynamic-schema';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schema);
    }

  }, [title, description, image, path, schema]);

  return null;
};

export default SEO;