/* eslint-disable no-undef */

/**
 * FAP Beautifier Content Script
 * - Kiểm tra trạng thái extension trước khi can thiệp vào DOM
 * - Lưu trữ dữ liệu trang gốc để React app có thể sử dụng
 * - Chỉ chèn React app khi extension được bật
 */

// Kiểm tra trạng thái extension từ storage trực tiếp
const checkExtensionState = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Access storage directly instead of sending messages
      chrome.storage.local.get('enabled', (data) => {
        // Default to enabled if value doesn't exist
        const isEnabled = data['enabled'] === undefined ? true : !!data['enabled'];
        resolve(isEnabled);
      });
    } catch (error) {
      console.error('Error checking extension state:', error);
      // Default to enabled in case of error
      resolve(true);
    }
  });
};

// Chèn React app khi extension được bật
const injectReactApp = () => {
  // Kiểm tra nếu đây là trang FAP
  const eventTarget = document.querySelector('input[name="__VIEWSTATEGENERATOR"]');
  if (!eventTarget) {
    console.log('Not a FAP page, skipping injection');
    return; // Không phải trang FAP, thoát sớm
  }

  try {
    // Lưu trữ dữ liệu trang gốc để React app có thể sử dụng
    const container = document.querySelector('.container');
    if (container) {
      const sanitized = container.cloneNode(true) as Element;
      const removalSelectors = [
        '#ctl00_divSupport',
        '#ctl00_divSupporthcm',
        '.qr', // Survey QR code
        'div.qr', // Survey QR code div
      ];
      removalSelectors.forEach((selector) => {
        sanitized.querySelectorAll(selector).forEach((node) => node.remove());
      });
      
      // Remove paragraphs with "Powered by" text
      sanitized.querySelectorAll('p').forEach((paragraph) => {
        if (paragraph.textContent?.includes('Powered by')) {
          paragraph.remove();
        }
      });
      
      // Remove links to survey, greenwich.edu.vn, cms.greenwich.edu.vn, and Facebook Greenwich
      sanitized.querySelectorAll('a').forEach((link) => {
        const href = link.getAttribute('href') || '';
        const text = link.textContent?.toLowerCase() || '';
        
        if (
          href.includes('survey.greenwich.edu.vn') ||
          href.includes('greenwich.edu.vn') ||
          href.includes('cms.greenwich.edu.vn') ||
          href.includes('facebook.com/GreenwichVietNam') ||
          href.includes('facebook.com/Greenwich') ||
          href.includes('survey.png') ||
          href.includes('survey.php') ||
          text.includes('powered by') ||
          text.includes('cms')
        ) {
          // Remove the link but keep its text content if it's not just the link
          const parent = link.parentElement;
          if (parent && parent.tagName === 'P' && parent.textContent?.includes('Powered by')) {
            parent.remove();
          } else if (parent && parent.classList.contains('qr')) {
            parent.remove();
          } else {
            link.remove();
          }
        }
      });
      
      // Remove images with survey.png or Facebook links
      sanitized.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src') || '';
        const parent = img.parentElement;
        const parentHref = parent?.getAttribute('href') || '';
        
        if (
          src.includes('survey.png') ||
          parentHref.includes('facebook.com/GreenwichVietNam') ||
          parentHref.includes('facebook.com/Greenwich')
        ) {
          const container = img.closest('div.qr, .qr, a[href*="survey"], a[href*="facebook"]');
          if (container) {
            container.remove();
          } else {
            img.remove();
          }
        }
      });
      window._data = {
        element: sanitized,
        timestamp: Date.now(),
        title: document.title,
      }
    }

    // Thay thế trang với React root
    document.body.classList.add('text-foreground', 'bg-background', 'flex', 'h-full', 'text-base', 'antialiased');
    document.body.innerHTML = '<div class="flex grow" id="root"></div>';

    // Thiết lập nội dung head tối thiểu (React sẽ bổ sung)
    document.head.innerHTML = `
        <title>FPT University Academic Portal</title>
        <meta charset="utf-8" />
          <link rel="icon" href="/media/app/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charset="utf-8" />
          <meta name="description" content="" />
          <meta
            name="keywords"
            content="keenthemes,react,material,kit,application,dashboard,admin,template"
          />
          <meta name="author" content="HieuVu.Me" />
          <style>
            .dark body {
              background-color: hsl(240 10% 4%);
            }
          </style>
          <script>
            (function () {
              try {
                const theme = localStorage.getItem('theme') || 'system';
                const prefersDark = window.matchMedia(
                  '(prefers-color-scheme: dark)',
                ).matches;
                const isDarkMode =
                  theme === 'dark' || (theme === 'system' && prefersDark);
                if (isDarkMode) document.documentElement.classList.add('dark');
              } catch (e) {}
            })();
          </script>
      `;

    console.log('FAP Beautifier: React app injected successfully');
  } catch (error) {
    console.error('FAP Beautifier: Error injecting React app', error);
  }
};

// Khởi tạo khi DOM sẵn sàng
const initialize = async () => {
  try {
    // Kiểm tra trạng thái extension
    const isEnabled = await checkExtensionState();

    if (isEnabled) {
      // Chỉ chèn React app nếu extension được bật
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectReactApp);
      } else {
        // DOM đã tải xong, chèn ngay lập tức
        injectReactApp();
      }
      console.log('FAP Beautifier: Extension is enabled');
    } else {
      console.log('FAP Beautifier: Extension is disabled');
    }
  } catch (error) {
    console.error('FAP Beautifier: Initialization error', error);
  }
};

// Khởi tạo content script
initialize();

// Lắng nghe tin nhắn từ popup hoặc background với xử lý lỗi
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message.reload) {
      // Add a slight delay before reloading to ensure all components are ready
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
    // Acknowledge the message
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error processing message:', error);
    // Still send a response
    sendResponse({ success: false });
  }
  return true; // Keep channel open for async response
}); 