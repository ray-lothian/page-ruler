chrome.runtime.onMessage.addListener((request, sender) => {
  chrome.action.setIcon({
    tabId: sender.tab.id,
    path: {
      '16': '/data/icons/16.png',
      '32': '/data/icons/32.png',
      '48': '/data/icons/48.png'
    }
  });
  chrome.scripting.executeScript({
    target: {
      tabId: sender.tab.id
    },
    func: () => {
      [...document.querySelectorAll('.pgrwx')].forEach(e => e.remove());
    }
  });
});

chrome.action.onClicked.addListener(async tab => {
  try {
    const r = await chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      func: tabId => {
        const es = [...document.querySelectorAll('.pgrwx')];

        if (es.length) {
          es.forEach(e => e.remove());

          return true;
        }
        else {
          const style = document.createElement('style');
          style.classList.add('pgrwx');
          style.textContent = `
            dialog.pgrwx {
              background: transparent;
              max-width: initial;
              max-height: initial;
              padding: 0;
              margin: 0;
              box-sizing: border-box;
              border: none;
              color-scheme: light;
            }
            dialog.pgrwx::backdrop {
              background: transparent;
            }
            dialog.pgrwx > iframe {
              border: none;
              width: 100vw;
              height: 100vh;
            }
          `;
          const dialog = document.createElement('dialog');
          dialog.classList.add('pgrwx');
          const f = document.createElement('iframe');
          f.src = chrome.runtime.getURL('/data/view/index.html?tabId=' + tabId);
          dialog.append(f);
          (document.body || document.documentElement).append(style, dialog);
          dialog.showModal();
          f.focus();
          return false;
        }
      },
      args: [tab.id]
    });
    chrome.action.setIcon({
      tabId: tab.id,
      path: {
        '16': '/data/icons/' + (r[0].result ? '' : 'active/') + '16.png',
        '32': '/data/icons/' + (r[0].result ? '' : 'active/') + '32.png',
        '48': '/data/icons/' + (r[0].result ? '' : 'active/') + '48.png'
      }
    });
  }
  catch (e) {
    chrome.tabs.create({
      url: '/data/view/index.html',
      index: tab.index + 1
    });
  }
});

const context = () => chrome.storage.local.get({
  size: 50,
  width: 1
}, prefs => {
  chrome.contextMenus.create({
    title: 'Grid Size',
    id: 'size',
    contexts: ['action']
  });
  chrome.contextMenus.create({
    title: '5px',
    id: 'size.5',
    parentId: 'size',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.size === 5
  });
  chrome.contextMenus.create({
    title: '10px',
    id: 'size.10',
    parentId: 'size',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.size === 10
  });
  chrome.contextMenus.create({
    title: '15px',
    id: 'size.15',
    parentId: 'size',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.size === 15
  });
  chrome.contextMenus.create({
    title: '20px',
    id: 'size.20',
    parentId: 'size',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.size === 20
  });
  chrome.contextMenus.create({
    title: '50px',
    id: 'size.50',
    parentId: 'size',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.size === 50
  });
  chrome.contextMenus.create({
    title: '100px',
    id: 'size.100',
    parentId: 'size',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.size === 100
  });
  chrome.contextMenus.create({
    title: '150px',
    id: 'size.150',
    parentId: 'size',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.size === 150
  });
  chrome.contextMenus.create({
    title: '200px',
    id: 'size.200',
    parentId: 'size',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.size === 200
  });
  chrome.contextMenus.create({
    title: '250px',
    id: 'size.250',
    parentId: 'size',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.size === 250
  });

  chrome.contextMenus.create({
    title: 'Border Thinness',
    id: 'width',
    contexts: ['action']
  });
  chrome.contextMenus.create({
    title: '1px',
    id: 'width.1',
    parentId: 'width',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.width === 1
  });
  chrome.contextMenus.create({
    title: '2px',
    id: 'width.2',
    parentId: 'width',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.width === 2
  });
  chrome.contextMenus.create({
    title: '3px',
    id: 'width.3',
    parentId: 'width',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.width === 3
  });
  chrome.contextMenus.create({
    title: '4px',
    id: 'width.4',
    parentId: 'width',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.width === 4
  });
  chrome.contextMenus.create({
    title: '5px',
    id: 'width.5',
    parentId: 'width',
    contexts: ['action'],
    type: 'radio',
    checked: prefs.width === 5
  });
});
chrome.runtime.onStartup.addListener(context);
chrome.runtime.onInstalled.addListener(context);

chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId.startsWith('width.')) {
    chrome.storage.local.set({
      'width': Number(info.menuItemId.slice(6))
    });
  }
  else if (info.menuItemId.startsWith('size.')) {
    chrome.storage.local.set({
      'size': Number(info.menuItemId.slice(5))
    });
  }
});

/* FAQs & Feedback */
{
  const {management, runtime: {onInstalled, setUninstallURL, getManifest}, storage, tabs} = chrome;
  if (navigator.webdriver !== true) {
    const page = getManifest().homepage_url;
    const {name, version} = getManifest();
    onInstalled.addListener(({reason, previousVersion}) => {
      management.getSelf(({installType}) => installType === 'normal' && storage.local.get({
        'faqs': true,
        'last-update': 0
      }, prefs => {
        if (reason === 'install' || (prefs.faqs && reason === 'update')) {
          const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
          if (doUpdate && previousVersion !== version) {
            tabs.query({active: true, currentWindow: true}, tbs => tabs.create({
              url: page + '?version=' + version + (previousVersion ? '&p=' + previousVersion : '') + '&type=' + reason,
              active: reason === 'install',
              ...(tbs && tbs.length && {index: tbs[0].index + 1})
            }));
            storage.local.set({'last-update': Date.now()});
          }
        }
      }));
    });
    setUninstallURL(page + '?rd=feedback&name=' + encodeURIComponent(name) + '&version=' + version);
  }
}
