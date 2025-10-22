import { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const useMetaTags = ({ title, description, image, url }: MetaTagsProps) => {
  useEffect(() => {
    if (title) {
      document.title = title;
      
      // Update Open Graph title
      updateMetaTag('og:title', title);
      updateMetaTag('twitter:title', title);
    }

    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description);
      updateMetaTag('twitter:description', description);
    }

    if (image) {
      updateMetaTag('og:image', image);
      updateMetaTag('twitter:image', image);
    }

    if (url) {
      updateMetaTag('og:url', url);
      updateMetaTag('twitter:url', url);
    }
  }, [title, description, image, url]);
};

const updateMetaTag = (property: string, content: string) => {
  // Check for both 'property' and 'name' attributes
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
  }

  if (element) {
    element.content = content;
  } else {
    // Create new meta tag if it doesn't exist
    const meta = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      meta.setAttribute('property', property);
    } else {
      meta.setAttribute('name', property);
    }
    meta.content = content;
    document.head.appendChild(meta);
  }
};
