/**
 * WebWize Proof -- Standalone Frontend Snippet
 * Zero dependencies. Self-activates via ?proof= or ?review= URL param.
 */
(function () {
    'use strict';

    var cfg = window.wwpsConfig || {};
    if (!cfg.proofToken && !cfg.reviewToken) return;

    var API        = cfg.ajaxUrl;
    var MODE       = cfg.mode;
    var TOKEN      = MODE === 'review' ? cfg.reviewToken : cfg.proofToken;
    var PAGE_URL   = cfg.pageUrl;
    var PAGE_TITLE = cfg.pageTitle;

    var COLORS = {
        red:    '#e94560',
        dark:   '#0f172a',
        blue:   '#3182ce',
        green:  '#38a169',
        orange: '#dd6b20',
        yellow: '#d69e2e',
        white:  '#ffffff',
        light:  '#f7fafc',
        border: '#e2e8f0',
        gray:   '#718096',
    };

    var PRIORITY_COLORS = {
        critical: '#DD4D3F',
        hot:      '#A936BD',
        warm:     '#DDC43F',
        cold:     '#3692BD',
    };

    function mkEl(tag, styles, props) {
        var e = document.createElement(tag);
        if (styles) { Object.keys(styles).forEach(function(k){ e.style[k] = styles[k]; }); }
        if (props)  { Object.keys(props).forEach(function(k){ e[k] = props[k]; }); }
        return e;
    }

    // Apply styles with !important so no site stylesheet can override them
    function forceStyles(el, stylesMap) {
        var cssProp = function(k) { return k.replace(/([A-Z])/g, function(c){ return '-' + c.toLowerCase(); }); };
        Object.keys(stylesMap).forEach(function(k) { el.style.setProperty(cssProp(k), stylesMap[k], 'important'); });
    }

    // ── Floating root ────────────────────────────────────────────────────────
    // Uses the Popover API (top-layer) when available — immune to CSS transforms,
    // z-index stacking contexts, and any theme/plugin CSS on body or html.
    // Falls back to a fixed div on the html element for older browsers.
    function getFloatingRoot() {
        var existing = document.getElementById('wwps-floating-root');
        if (existing) return existing;

        var root = document.createElement('div');
        root.id  = 'wwps-floating-root';

        if (typeof root.showPopover === 'function') {
            // ── Popover API path (Chrome 114+, Safari 17+, Firefox 125+) ──
            root.setAttribute('popover', 'manual');
            document.body.appendChild(root);
            root.showPopover();
            // In the top layer, popover defaults to fixed; fill the viewport.
            var ps = root.style;
            ps.setProperty('inset',          '0',          'important');
            ps.setProperty('width',          '100vw',      'important');
            ps.setProperty('height',         '100vh',      'important');
            ps.setProperty('max-width',      'none',       'important');
            ps.setProperty('max-height',     'none',       'important');
            ps.setProperty('padding',        '0',          'important');
            ps.setProperty('margin',         '0',          'important');
            ps.setProperty('border',         'none',       'important');
            ps.setProperty('background',     'transparent','important');
            ps.setProperty('pointer-events', 'none',       'important');
            ps.setProperty('overflow',       'visible',    'important');
        } else {
            // ── Fallback: fixed div on <html> (avoids body transforms) ──
            var fs = root.style;
            fs.setProperty('position',       'fixed',      'important');
            fs.setProperty('top',            '0',          'important');
            fs.setProperty('left',           '0',          'important');
            fs.setProperty('width',          '100%',       'important');
            fs.setProperty('height',         '100%',       'important');
            fs.setProperty('pointer-events', 'none',       'important');
            fs.setProperty('z-index',        '2147483600', 'important');
            fs.setProperty('overflow',       'visible',    'important');
            fs.setProperty('background',     'transparent','important');
            document.documentElement.appendChild(root);
        }
        return root;
    }

    // ── Make a floating panel draggable by a header handle ───────────────────
    // Converts a right-anchored panel to left-anchored on first grab so the
    // drag math works regardless of which edge the panel started pinned to.
    function makeDraggable(panel, handle) {
        var dragging = false, offX = 0, offY = 0;
        handle.addEventListener('mousedown', function(e) {
            if (e.target.closest('button')) return;  // let header buttons click normally
            dragging = true;
            var rect = panel.getBoundingClientRect();
            panel.style.setProperty('left',  rect.left + 'px', 'important');
            panel.style.setProperty('right', 'auto',           'important');
            offX = e.clientX - rect.left;
            offY = e.clientY - rect.top;
            handle.style.cursor = 'grabbing';
            e.preventDefault();
        });
        document.addEventListener('mousemove', function(e) {
            if (!dragging) return;
            var x = Math.max(8, Math.min(e.clientX - offX, window.innerWidth  - panel.offsetWidth - 8));
            var y = Math.max(8, Math.min(e.clientY - offY, window.innerHeight - 60));
            panel.style.setProperty('left', x + 'px', 'important');
            panel.style.setProperty('top',  y + 'px', 'important');
        });
        document.addEventListener('mouseup', function() {
            if (dragging) { dragging = false; handle.style.cursor = 'grab'; }
        });
    }

    function post(endpoint, data) {
        return fetch(API + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': cfg.nonce || '' },
            body: JSON.stringify(data),
        }).then(function(r){ return r.json(); });
    }

    // =========================================================================
    //  Cookie helpers (30-day persistence for submitter identity)
    // =========================================================================
    var COOKIE_KEY = 'wwps_submitter';

    function setCookie(name, value, days) {
        try {
            var exp = new Date();
            exp.setDate(exp.getDate() + days);
            document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + exp.toUTCString() + ';path=/;SameSite=Lax';
        } catch(e) {}
    }

    function getCookie(name) {
        try {
            var prefix = name + '=';
            var parts  = document.cookie.split(';');
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i].trim();
                if (part.indexOf(prefix) === 0) {
                    return decodeURIComponent(part.slice(prefix.length));
                }
            }
        } catch(e) {}
        return '';
    }

    function getSavedSubmitter() {
        var raw = getCookie(COOKIE_KEY);
        if (!raw) return { name: '', email: '' };
        try { return JSON.parse(raw); } catch(e) { return { name: '', email: '' }; }
    }

    function saveSubmitter(name, email) {
        if (name || email) {
            setCookie(COOKIE_KEY, JSON.stringify({ name: name, email: email }), 30);
        }
    }

    function get(endpoint, params) {
        var qs = new URLSearchParams(params).toString();
        return fetch(API + endpoint + (qs ? '?' + qs : ''), {
            headers: { 'X-WP-Nonce': cfg.nonce || '' },
        }).then(function(r){ return r.json(); });
    }

    // Element Fingerprinting
    function getSelector(node) {
        var parts = [];
        for (var i = 0; i < 5 && node && node !== document.body; i++) {
            var seg = node.tagName.toLowerCase();
            if (node.id) { seg += '#' + node.id; parts.unshift(seg); break; }
            if (node.className && typeof node.className === 'string') {
                var cls = node.className.trim().split(/\s+/).slice(0, 2).join('.');
                if (cls) seg += '.' + cls;
            }
            var siblings = node.parentNode
                ? Array.prototype.filter.call(node.parentNode.children, function(c){ return c.tagName === node.tagName; })
                : [];
            if (siblings.length > 1) seg += ':nth-of-type(' + (siblings.indexOf(node) + 1) + ')';
            parts.unshift(seg);
            node = node.parentNode;
        }
        return parts.join(' > ');
    }

    function getTextContext(targetEl) {
        var text   = document.body.innerText || '';
        var elText = targetEl.innerText || targetEl.textContent || '';
        var idx    = text.indexOf(elText.slice(0, 30));
        if (idx === -1) return { before: '', after: '' };
        return {
            before: text.slice(Math.max(0, idx - 60), idx).trim().slice(-60),
            after:  text.slice(idx + elText.length, idx + elText.length + 60).trim().slice(0, 60),
        };
    }

    function getDeviceInfo() {
        var ua = navigator.userAgent;
        var w  = window.innerWidth;
        var browser = 'Other';
        if (/Firefox/.test(ua))                          browser = 'Firefox';
        else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
        else if (/Edg/.test(ua))                          browser = 'Edge';
        else if (/Chrome/.test(ua))                       browser = 'Chrome';

        var os = 'Other';
        if (/Windows/.test(ua))      os = 'Windows';
        else if (/Mac/.test(ua))     os = 'macOS';
        else if (/iPhone|iPad/.test(ua)) os = 'iOS';
        else if (/Android/.test(ua)) os = 'Android';

        return {
            device_type:     w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop',
            viewport_width:  w,
            viewport_height: window.innerHeight,
            pixel_ratio:     window.devicePixelRatio || 1,
            browser:         browser,
            os:              os,
        };
    }

    function fingerprint(targetEl, evt) {
        var rect    = targetEl.getBoundingClientRect();
        var ctx     = getTextContext(targetEl);
        var scrollY = window.scrollY || window.pageYOffset;
        var docH    = Math.max(document.body.scrollHeight, 1);
        var dev     = getDeviceInfo();
        return {
            element_selector:    getSelector(targetEl),
            element_tag:         targetEl.tagName.toLowerCase(),
            element_text_before: ctx.before,
            element_text_after:  ctx.after,
            scroll_percent:      Math.round((scrollY / docH) * 100),
            viewport_x_percent:  Math.round(((evt.clientX - rect.left) / Math.max(rect.width, 1)) * 100),
            viewport_y_percent:  Math.round(((evt.clientY - rect.top)  / Math.max(rect.height, 1)) * 100),
            device_type:     dev.device_type,
            viewport_width:  dev.viewport_width,
            viewport_height: dev.viewport_height,
            pixel_ratio:     dev.pixel_ratio,
            browser:         dev.browser,
            os:              dev.os,
        };
    }

    // ── Cookie helpers — persist tokens across page navigations ─────────────
    (function() {
        var maxAge = 7 * 24 * 3600; // 7 days
        var path   = '; path=/; SameSite=Lax';
        if (cfg.proofToken)  document.cookie = 'wwps_proof='  + encodeURIComponent(cfg.proofToken)  + '; max-age=' + maxAge + path;
        if (cfg.reviewToken) document.cookie = 'wwps_review=' + encodeURIComponent(cfg.reviewToken) + '; max-age=' + maxAge + path;
    })();

    // Validate token then boot
    var PROJECT = null;
    post('/validate', { token: TOKEN, mode: MODE }).then(function(res) {
        if (!res.valid) { console.warn('[WebWize Proof] Invalid token.'); return; }
        PROJECT = res;
        if (MODE === 'review') { bootReview(); } else { bootProof(); }
    }).catch(function() { console.warn('[WebWize Proof] Could not reach API.'); });

    // ========================================================================
    //  PROOF MODE
    // ========================================================================
    function bootProof() {
        buildProofToolbar();

        var hoveredEl       = null;
        var selectedEl      = null;
        var fingerData      = null;
        var proofActive     = false;
        var selectionLocked = false;  // true once an element is clicked for commenting

        // The hover ring lives inside the transform-immune floating root so its
        // viewport-based getBoundingClientRect() coordinates always line up — no
        // matter what CSS transform the theme applies to <html>/<body>/wrappers.
        var ring = mkEl('div', {
            position: 'absolute', pointerEvents: 'none', zIndex: '2147483645',
            border: '2px solid ' + COLORS.red, borderRadius: '3px',
            boxShadow: '0 0 0 3px rgba(233,69,96,.2)',
            transition: 'all .1s ease', display: 'none',
        });
        getFloatingRoot().appendChild(ring);

        var panel = buildProofPanel();

        // Draw the ring exactly around a given element (viewport coords).
        function positionRingTo(el) {
            var r = el.getBoundingClientRect();
            ring.style.display = 'block';
            ring.style.top     = (r.top  - 2) + 'px';
            ring.style.left    = (r.left - 2) + 'px';
            ring.style.width   = (r.width  + 4) + 'px';
            ring.style.height  = (r.height + 4) + 'px';
        }

        function highlightEl(e) {
            // While an element is locked in for commenting, stop the ring from
            // chasing the cursor — it stays pinned to the element you clicked.
            if (!proofActive || selectionLocked || panel.contains(e.target)) return;
            hoveredEl = e.target;
            positionRingTo(hoveredEl);
        }

        function onClick(e) {
            if (!proofActive) return;
            if (panel.contains(e.target)) return;
            e.preventDefault(); e.stopPropagation();
            selectedEl      = e.target;
            fingerData      = fingerprint(selectedEl, e);
            selectionLocked = true;                 // freeze the ring on this element
            ring.style.borderColor = COLORS.orange;
            positionRingTo(selectedEl);             // pin the ring exactly on it
            openPanel();
        }

        // Keep the locked ring glued to its element if the page scrolls/resizes.
        function reanchorRing() {
            if (selectionLocked && selectedEl) positionRingTo(selectedEl);
        }

        document.addEventListener('mouseover', highlightEl, true);
        document.addEventListener('click', onClick, true);
        window.addEventListener('scroll', reanchorRing, true);
        window.addEventListener('resize', reanchorRing);

        function openPanel() {
            panel.style.setProperty('display',   'flex',        'important');
            panel.style.setProperty('opacity',   '0',           'important');
            panel.style.setProperty('transform', 'scale(0.96)', 'important');
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    panel.style.setProperty('opacity',   '1',        'important');
                    panel.style.setProperty('transform', 'scale(1)', 'important');
                });
            });
            var ta = panel.querySelector('#wwps-comment');
            if (ta) ta.focus();
        }

        function closePanel() {
            panel.style.setProperty('opacity',   '0',           'important');
            panel.style.setProperty('transform', 'scale(0.96)', 'important');
            setTimeout(function() { panel.style.setProperty('display', 'none', 'important'); }, 150);
            ring.style.borderColor = COLORS.red;
            ring.style.display = 'none';
            selectedEl = null; fingerData = null;
            selectionLocked = false;   // release the lock so hover-highlight works again
        }

        panel.querySelector('#wwps-submit').addEventListener('click', function () {
            var comment  = panel.querySelector('#wwps-comment').value.trim();
            var name     = panel.querySelector('#wwps-author-name').value.trim();
            var email    = panel.querySelector('#wwps-author-email').value.trim();
            var priEl    = panel.querySelector('input[name="wwps-priority"]:checked');
            var priority = priEl ? priEl.value : 'warm';

            if (!comment) { panel.querySelector('#wwps-comment').style.borderColor = COLORS.red; return; }

            var btn = this;
            btn.disabled = true; btn.textContent = 'Sending...';

            var payload = {
                proof_token:  TOKEN,
                page_url:     PAGE_URL,
                page_title:   PAGE_TITLE,
                comment:      comment,
                priority:     priority,
                author_name:  name  || 'Anonymous',
                author_email: email || '',
            };
            Object.keys(fingerData).forEach(function(k){ payload[k] = fingerData[k]; });

            function doSubmit(imageUrl) {
                if (imageUrl) payload.image_url = imageUrl;
                post('/submit', payload).then(function(res) {
                    if (res.success) {
                        // Persist name/email for next visit
                        saveSubmitter(name, email);
                        showSuccess(panel, res.ticket_id, name || null);
                        panel.querySelector('#wwps-comment').value = '';
                        clearImageSelection();
                        // Auto-exit comment mode so links are clickable again
                        proofActive = false;
                        document.body.style.cursor = '';
                        ring.style.display = 'none';
                        toggleBtn.style.background = 'rgba(255,255,255,.15)';
                        toggleBtn.textContent = '+ Click to Comment';
                        setTimeout(closePanel, 3000);
                    } else {
                        btn.disabled = false; btn.textContent = 'Submit Feedback';
                        alert('Error submitting feedback. Please try again.');
                    }
                });
            }

            if (selectedImageFile) {
                btn.textContent = 'Uploading image...';
                var fd = new FormData();
                fd.append('image', selectedImageFile);
                fd.append('proof_token', TOKEN);
                fetch(API + '/upload', { method: 'POST', body: fd })
                    .then(function(r) { return r.json(); })
                    .then(function(res) {
                        if (res.success) {
                            doSubmit(res.url);
                        } else {
                            btn.disabled = false; btn.textContent = 'Submit Feedback';
                            uploadErr.textContent = res.error || 'Image upload failed. Please try again.';
                            uploadErr.style.display = 'block';
                        }
                    })
                    .catch(function() {
                        btn.disabled = false; btn.textContent = 'Submit Feedback';
                        uploadErr.textContent = 'Image upload failed. Check your connection and try again.';
                        uploadErr.style.display = 'block';
                    });
            } else {
                doSubmit(null);
            }
        });

        panel.querySelector('#wwps-close').addEventListener('click', closePanel);
        panel.querySelector('#wwps-cancel').addEventListener('click', closePanel);

        // Image upload — client-side validation then preview
        var selectedImageFile = null;
        var ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        var MAX_BYTES = 300 * 1024; // 300KB

        var fileInput   = panel.querySelector('#wwps-image-file');
        var previewWrap = panel.querySelector('#wwps-upload-preview');
        var previewImg  = panel.querySelector('#wwps-preview-img');
        var removeBtn   = panel.querySelector('#wwps-remove-image');
        var uploadErr   = panel.querySelector('#wwps-upload-error');

        function clearImageSelection() {
            selectedImageFile = null;
            fileInput.value   = '';
            previewWrap.style.display = 'none';
            previewImg.src    = '';
            uploadErr.style.display = 'none';
        }

        fileInput.addEventListener('change', function () {
            uploadErr.style.display = 'none';
            var file = this.files[0];
            if (!file) return;

            // Size check — no upload needed
            if (file.size > MAX_BYTES) {
                uploadErr.textContent = 'File is ' + Math.round(file.size / 1024) + 'KB — must be under 300KB. Please resize and try again.';
                uploadErr.style.display = 'block';
                this.value = '';
                return;
            }

            // MIME type check — browser-side (server re-checks magic bytes)
            if (ALLOWED_TYPES.indexOf(file.type) === -1) {
                uploadErr.textContent = 'Only JPEG, PNG, GIF, and WebP images are allowed.';
                uploadErr.style.display = 'block';
                this.value = '';
                return;
            }

            selectedImageFile = file;
            var reader = new FileReader();
            reader.onload = function (e) {
                previewImg.src = e.target.result;
                previewWrap.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });

        removeBtn.addEventListener('click', clearImageSelection);

        var toolbar   = document.getElementById('wwps-toolbar');
        var toggleBtn = toolbar.querySelector('#wwps-toggle');
        toggleBtn.addEventListener('click', function () {
            proofActive = !proofActive;
            document.body.style.cursor    = proofActive ? 'crosshair' : '';
            toggleBtn.style.background    = proofActive ? '#DE863F' : 'rgba(255,255,255,.15)';
            toggleBtn.textContent         = proofActive ? 'Stop Commenting' : '+ Click to Comment';
            if (!proofActive) closePanel();
        });
    }

    function buildProofToolbar() {
        var bar = mkEl('div', {
            position: 'absolute', bottom: '20px', left: '50%',
            transform: 'translateX(-50%)', zIndex: '2147483647',
            display: 'flex', alignItems: 'center', gap: '10px',
            background: COLORS.dark, color: COLORS.white,
            borderRadius: '30px', padding: '8px 16px',
            boxShadow: '0 4px 20px rgba(0,0,0,.4)',
            fontFamily: 'system-ui,sans-serif', fontSize: '13px',
            pointerEvents: 'auto',
        }, { id: 'wwps-toolbar' });

        bar.innerHTML =
            '<span style="display:inline-block;background:#fff;border:2px solid ' + COLORS.orange + ';border-radius:16px;padding:2px 10px;margin:-2px 0;font-weight:700;letter-spacing:.5px;color:' + COLORS.dark + ';">WEBWIZE <span style="color:' + COLORS.orange + '">PROOF</span></span>' +
            '<span style="width:1px;height:20px;background:rgba(255,255,255,.2);"></span>' +
            '<button id="wwps-toggle" style="background:rgba(255,255,255,.15);color:#fff;border:none;border-radius:20px;padding:5px 14px;cursor:pointer;font-size:13px;">+ Click to Comment</button>' +
            '<span style="font-size:11px;opacity:.6;">Proof mode</span>';

        getFloatingRoot().appendChild(bar);
    }

    function buildProofPanel() {
        // Floating, draggable card inside the transform-immune floating root.
        var panel = document.createElement('div');
        panel.id = 'wwps-proof-panel';
        var ps = panel.style;
        ps.setProperty('position',        'absolute',   'important');
        ps.setProperty('top',             '80px',       'important');
        ps.setProperty('right',           '20px',       'important');
        ps.setProperty('left',            'auto',       'important');
        ps.setProperty('width',           '380px',      'important');
        ps.setProperty('max-width',       'calc(100vw - 32px)', 'important');
        ps.setProperty('max-height',      'calc(100vh - 120px)', 'important');
        ps.setProperty('background',      'rgba(255,255,255,0.96)', 'important');
        ps.setProperty('backdrop-filter', 'blur(12px)', 'important');
        ps.setProperty('-webkit-backdrop-filter', 'blur(12px)', 'important');
        ps.setProperty('border-radius',   '8px',        'important');
        ps.setProperty('box-shadow',      '0 8px 32px rgba(0,0,0,.35), 0 2px 8px rgba(0,0,0,.18)', 'important');
        ps.setProperty('border',          '1px solid rgba(0,0,0,.12)', 'important');
        ps.setProperty('z-index',         '2147483646', 'important');
        ps.setProperty('display',         'none',       'important');
        ps.setProperty('flex-direction',  'column',     'important');
        ps.setProperty('font-family',     'system-ui,sans-serif', 'important');
        ps.setProperty('font-size',       '14px',       'important');
        ps.setProperty('overflow',        'hidden',     'important');
        ps.setProperty('transition',      'opacity .15s, transform .15s', 'important');
        ps.setProperty('transform-origin','top right',  'important');
        ps.setProperty('pointer-events',  'auto',       'important');

        // ── Header (drag handle) ──────────────────────────────────────────────
        var header = mkEl('div', {
            background: COLORS.dark, color: '#fff',
            display: 'flex', alignItems: 'center',
            padding: '11px 14px', gap: '10px',
            cursor: 'grab', flexShrink: '0',
            borderRadius: '6px 6px 0 0', userSelect: 'none',
        });
        header.innerHTML =
            '<svg width="10" height="16" viewBox="0 0 10 16" fill="rgba(255,255,255,.4)" style="flex-shrink:0;">' +
                '<circle cx="3" cy="3"  r="1.5"/><circle cx="7" cy="3"  r="1.5"/>' +
                '<circle cx="3" cy="8"  r="1.5"/><circle cx="7" cy="8"  r="1.5"/>' +
                '<circle cx="3" cy="13" r="1.5"/><circle cx="7" cy="13" r="1.5"/>' +
            '</svg>' +
            '<strong style="flex:1;font-size:13px;">Leave Feedback</strong>' +
            '<button id="wwps-close" title="Close" style="background:rgba(255,255,255,.15);border:none;color:#fff;width:22px;height:22px;border-radius:50%;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;flex-shrink:0;">&#x2715;</button>';

        var priorityHtml = ['critical','hot','warm','cold'].map(function(p, i) {
            return '<label style="display:flex;align-items:center;gap:5px;cursor:pointer;">' +
                '<input type="radio" name="wwps-priority" value="' + p + '"' + (i === 2 ? ' checked' : '') + '>' +
                '<span style="background:' + PRIORITY_COLORS[p] + ';color:#fff;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:600;">' +
                p.charAt(0).toUpperCase() + p.slice(1) + '</span></label>';
        }).join('');

        // ── Scrollable body ───────────────────────────────────────────────────
        var body = mkEl('div', { overflowY: 'auto', flex: '1', padding: '18px' });
        body.innerHTML =
                '<label style="display:block;margin-bottom:12px;">' +
                    '<span style="font-weight:600;display:block;margin-bottom:4px;">Your feedback <span style="color:' + COLORS.red + '">*</span></span>' +
                    '<textarea id="wwps-comment" rows="5" placeholder="Describe what needs to change..." style="width:100%;padding:10px;border:1px solid ' + COLORS.border + ';border-radius:4px;font-size:14px;resize:vertical;box-sizing:border-box;"></textarea>' +
                '</label>' +
                '<fieldset style="border:1px solid ' + COLORS.border + ';border-radius:4px;padding:10px 14px;margin-bottom:12px;">' +
                    '<legend style="font-weight:600;padding:0 6px;">Priority</legend>' +
                    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">' + priorityHtml + '</div>' +
                '</fieldset>' +
                '<label style="display:block;margin-bottom:8px;">' +
                    '<span style="font-weight:600;display:block;margin-bottom:4px;">Your name</span>' +
                    '<input id="wwps-author-name" type="text" placeholder="Jane Smith" style="width:100%;padding:8px 10px;border:1px solid ' + COLORS.border + ';border-radius:4px;font-size:14px;box-sizing:border-box;">' +
                '</label>' +
                '<label style="display:block;margin-bottom:16px;">' +
                    '<span style="font-weight:600;display:block;margin-bottom:4px;">Your email <span style="font-weight:400;color:#718096;">(for updates)</span></span>' +
                    '<input id="wwps-author-email" type="email" placeholder="jane@example.com" style="width:100%;padding:8px 10px;border:1px solid ' + COLORS.border + ';border-radius:4px;font-size:14px;box-sizing:border-box;">' +
                '</label>' +
                '<div style="margin-bottom:16px;">' +
                    '<span style="font-weight:600;display:block;margin-bottom:4px;">Attach image <span style="font-weight:400;color:#718096;">(optional &mdash; max 300KB)</span></span>' +
                    '<input id="wwps-image-file" type="file" accept="image/jpeg,image/png,image/gif,image/webp" style="width:100%;padding:6px 0;font-size:13px;cursor:pointer;">' +
                    '<div id="wwps-upload-preview" style="display:none;margin-top:8px;position:relative;">' +
                        '<img id="wwps-preview-img" style="max-width:100%;max-height:120px;border-radius:4px;border:1px solid #e2e8f0;display:block;">' +
                        '<button id="wwps-remove-image" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,.55);color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:13px;cursor:pointer;line-height:1;">&#x2715;</button>' +
                    '</div>' +
                    '<div id="wwps-upload-error" style="display:none;color:#DD4D3F;font-size:12px;margin-top:4px;"></div>' +
                '</div>' +
                '<div id="wwps-success" style="display:none;background:#d4edda;border:1px solid #c3e6cb;color:#155724;padding:12px 14px;border-radius:4px;margin-bottom:12px;"></div>' +
                '<button id="wwps-submit" style="width:100%;background:#DE863F;color:#fff;border:none;border-radius:4px;padding:12px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:8px;">Submit Feedback</button>' +
                '<button id="wwps-cancel" style="width:100%;background:#C93971;color:#fff;border:none;border-radius:4px;padding:10px;font-size:14px;font-weight:600;cursor:pointer;">Cancel</button>';

        panel.appendChild(header);
        panel.appendChild(body);
        getFloatingRoot().appendChild(panel);
        makeDraggable(panel, header);

        // Pre-fill name/email from cookie
        var saved = getSavedSubmitter();
        if (saved.name)  panel.querySelector('#wwps-author-name').value  = saved.name;
        if (saved.email) panel.querySelector('#wwps-author-email').value = saved.email;

        return panel;
    }

    function showSuccess(panel, ticketId, authorName) {
        var s = panel.querySelector('#wwps-success');
        s.style.display = 'block';
        var greeting = authorName ? 'Thank you, ' + authorName + '!' : 'Thank you!';
        s.innerHTML = greeting + ' Your feedback was submitted. Ticket <strong>' + ticketId + '</strong>.';
        var btn = panel.querySelector('#wwps-submit');
        btn.disabled = false; btn.textContent = 'Submit Feedback';
    }

    // ========================================================================
    //  REVIEW MODE
    // ========================================================================
    function bootReview() {
        buildReviewToolbar();

        get('/tasks', { token: TOKEN, page_url: PAGE_URL, status: 'open' }).then(function(res) {
            var countEl = document.getElementById('wwps-review-count');
            if (!res.tasks || !res.tasks.length) {
                if (countEl) countEl.textContent = 'No open tasks on this page';
                return;
            }
            if (countEl) countEl.textContent = res.tasks.length + ' open task' + (res.tasks.length !== 1 ? 's' : '');
            placePins(res.tasks);
            buildTaskListPanel(res.tasks);
        });
    }

    function buildReviewToolbar() {
        var bar = mkEl('div', {
            position: 'fixed', bottom: '20px', left: '50%',
            transform: 'translateX(-50%)', zIndex: '2147483647',
            display: 'flex', alignItems: 'center', gap: '10px',
            background: COLORS.dark, color: COLORS.white,
            borderRadius: '30px', padding: '8px 18px',
            boxShadow: '0 4px 20px rgba(0,0,0,.4)',
            fontFamily: 'system-ui,sans-serif', fontSize: '13px',
        }, { id: 'wwps-review-toolbar' });

        bar.innerHTML =
            '<span style="display:inline-block;background:#fff;border:2px solid ' + COLORS.orange + ';border-radius:16px;padding:2px 10px;margin:-2px 0;font-weight:700;letter-spacing:.5px;color:' + COLORS.dark + ';">WEBWIZE <span style="color:' + COLORS.orange + '">REVIEW</span></span>' +
            '<span style="width:1px;height:20px;background:rgba(255,255,255,.2);"></span>' +
            '<span id="wwps-review-count" style="font-size:12px;opacity:.8;">Loading...</span>' +
            '<button id="wwps-show-list" style="background:rgba(255,255,255,.15);color:#fff;border:none;border-radius:20px;padding:5px 14px;cursor:pointer;font-size:13px;">List Tasks</button>' +
            '<button id="wwps-approve-this-page" style="background:' + COLORS.green + ';color:#fff;border:none;border-radius:20px;padding:5px 14px;cursor:pointer;font-size:13px;">Approve Page</button>' +
            '<span style="width:1px;height:20px;background:rgba(255,255,255,.2);"></span>' +
            '<button id="wwps-open-support" style="background:#A836BE;color:#fff;border:none;border-radius:20px;padding:5px 14px;cursor:pointer;font-size:13px;font-weight:600;">Open Support Ticket</button>';

        document.body.appendChild(bar);

        document.getElementById('wwps-approve-this-page').addEventListener('click', function () {
            if (!confirm('Mark this page as approved? All task pins will be removed.')) return;
            var btn = this; btn.disabled = true; btn.textContent = '...';
            post('/approve-page', { token: TOKEN, page_url: PAGE_URL }).then(function(res) {
                if (res.success) {
                    btn.textContent = 'Approved!';
                    btn.style.background = '#276749';
                    // Remove all pins (open + completed) — page is signed off
                    removeAllPins();
                    // Close any open task panels
                    var dp = document.getElementById('wwps-detail-panel');
                    if (dp) dp.remove();
                    var tc = document.getElementById('wwps-task-card');
                    if (tc) tc.remove();
                    clearElementHighlight();
                    deactivatePin();
                } else {
                    btn.disabled = false;
                    btn.textContent = 'Approve Page';
                }
            });
        });

        document.getElementById('wwps-show-list').addEventListener('click', function () {
            var panel = document.getElementById('wwps-task-panel');
            if (panel) {
                var hidden = panel.style.getPropertyValue('display') === 'none' || panel.style.getPropertyValue('display') === '';
                if (hidden) {
                    panel.style.setProperty('display',   'flex',        'important');
                    panel.style.setProperty('opacity',   '0',           'important');
                    panel.style.setProperty('transform', 'scale(0.95)', 'important');
                    requestAnimationFrame(function() {
                        requestAnimationFrame(function() {
                            panel.style.setProperty('opacity',   '1',       'important');
                            panel.style.setProperty('transform', 'scale(1)','important');
                        });
                    });
                } else {
                    panel.style.setProperty('opacity',   '0',           'important');
                    panel.style.setProperty('transform', 'scale(0.95)', 'important');
                    setTimeout(function() { panel.style.setProperty('display', 'none', 'important'); }, 150);
                }
            }
        });

        document.getElementById('wwps-open-support').addEventListener('click', function () {
            var existing = document.getElementById('wwps-support-panel');
            if (!existing) { buildSupportPanel(); return; }
            var hidden = existing.style.getPropertyValue('display') === 'none';
            if (hidden) {
                existing.style.setProperty('display', 'flex', 'important');
                existing.style.setProperty('opacity', '0',    'important');
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        existing.style.setProperty('opacity', '1', 'important');
                    });
                });
            } else {
                existing.style.setProperty('opacity', '0', 'important');
                setTimeout(function() { existing.style.setProperty('display', 'none', 'important'); }, 150);
            }
        });
    }

    function buildSupportPanel() {
        // Floating, draggable card inside the transform-immune floating root.
        var panel = document.createElement('div');
        panel.id = 'wwps-support-panel';
        var ps = panel.style;
        ps.setProperty('position',        'absolute',   'important');
        ps.setProperty('top',             '80px',       'important');
        ps.setProperty('right',           '20px',       'important');
        ps.setProperty('left',            'auto',       'important');
        ps.setProperty('width',           '400px',      'important');
        ps.setProperty('max-width',       'calc(100vw - 32px)', 'important');
        ps.setProperty('max-height',      'calc(100vh - 120px)', 'important');
        ps.setProperty('background',      'rgba(255,255,255,0.96)', 'important');
        ps.setProperty('backdrop-filter', 'blur(12px)', 'important');
        ps.setProperty('-webkit-backdrop-filter', 'blur(12px)', 'important');
        ps.setProperty('border-radius',   '8px',        'important');
        ps.setProperty('box-shadow',      '0 8px 32px rgba(0,0,0,.35), 0 2px 8px rgba(0,0,0,.18)', 'important');
        ps.setProperty('border',          '1px solid rgba(0,0,0,.12)', 'important');
        ps.setProperty('z-index',         '2147483646', 'important');
        ps.setProperty('display',         'flex',       'important');
        ps.setProperty('flex-direction',  'column',     'important');
        ps.setProperty('font-family',     'system-ui,sans-serif', 'important');
        ps.setProperty('font-size',       '14px',       'important');
        ps.setProperty('overflow',        'hidden',     'important');
        ps.setProperty('transition',      'opacity .15s', 'important');
        ps.setProperty('pointer-events',  'auto',       'important');

        // ── Header (drag handle) ──────────────────────────────────────────────
        var header = mkEl('div', {
            background: '#A836BE', color: '#fff',
            display: 'flex', alignItems: 'center',
            padding: '11px 14px', gap: '10px',
            cursor: 'grab', flexShrink: '0',
            borderRadius: '6px 6px 0 0', userSelect: 'none',
        });
        header.innerHTML =
            '<svg width="10" height="16" viewBox="0 0 10 16" fill="rgba(255,255,255,.5)" style="flex-shrink:0;">' +
                '<circle cx="3" cy="3"  r="1.5"/><circle cx="7" cy="3"  r="1.5"/>' +
                '<circle cx="3" cy="8"  r="1.5"/><circle cx="7" cy="8"  r="1.5"/>' +
                '<circle cx="3" cy="13" r="1.5"/><circle cx="7" cy="13" r="1.5"/>' +
            '</svg>' +
            '<strong style="flex:1;font-size:13px;">Open Support Ticket</strong>' +
            '<button id="wwps-support-close" title="Close" style="background:rgba(255,255,255,.2);border:none;color:#fff;width:22px;height:22px;border-radius:50%;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;flex-shrink:0;">&#x2715;</button>';

        // ── Scrollable body ───────────────────────────────────────────────────
        var body = mkEl('div', { overflowY: 'auto', flex: '1', padding: '18px' });
        body.innerHTML =
                '<p style="margin:0 0 16px;font-size:13px;color:' + COLORS.gray + ';line-height:1.5;">Have a question or need help? Submit a ticket and we\'ll get back to you.</p>' +
                '<label style="display:block;margin-bottom:12px;">' +
                    '<span style="font-weight:600;display:block;margin-bottom:4px;">Subject <span style="color:#DD4D3F;">*</span></span>' +
                    '<input id="wwps-support-subject" type="text" placeholder="Briefly describe your issue..." style="width:100%;padding:8px 10px;border:1px solid ' + COLORS.border + ';border-radius:4px;font-size:14px;box-sizing:border-box;">' +
                '</label>' +
                '<label style="display:block;margin-bottom:12px;">' +
                    '<span style="font-weight:600;display:block;margin-bottom:4px;">Message <span style="color:#DD4D3F;">*</span></span>' +
                    '<textarea id="wwps-support-message" rows="6" placeholder="Describe what you need help with..." style="width:100%;padding:10px;border:1px solid ' + COLORS.border + ';border-radius:4px;font-size:14px;resize:vertical;box-sizing:border-box;"></textarea>' +
                '</label>' +
                '<label style="display:block;margin-bottom:8px;">' +
                    '<span style="font-weight:600;display:block;margin-bottom:4px;">Your name <span style="color:#DD4D3F;">*</span></span>' +
                    '<input id="wwps-support-name" type="text" placeholder="Jane Smith" style="width:100%;padding:8px 10px;border:1px solid ' + COLORS.border + ';border-radius:4px;font-size:14px;box-sizing:border-box;">' +
                '</label>' +
                '<label style="display:block;margin-bottom:20px;">' +
                    '<span style="font-weight:600;display:block;margin-bottom:4px;">Your email <span style="color:#DD4D3F;">*</span></span>' +
                    '<input id="wwps-support-email" type="email" placeholder="jane@example.com" style="width:100%;padding:8px 10px;border:1px solid ' + COLORS.border + ';border-radius:4px;font-size:14px;box-sizing:border-box;">' +
                '</label>' +
                '<div id="wwps-support-success" style="display:none;background:#d4edda;border:1px solid #c3e6cb;color:#155724;padding:12px 14px;border-radius:4px;margin-bottom:12px;"></div>' +
                '<div id="wwps-support-error" style="display:none;color:#DD4D3F;font-size:13px;margin-bottom:10px;"></div>' +
                '<button id="wwps-support-submit" style="width:100%;background:#A836BE;color:#fff;border:none;border-radius:4px;padding:12px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:8px;">Submit Ticket</button>' +
                '<button id="wwps-support-cancel" style="width:100%;background:#C93971;color:#fff;border:none;border-radius:4px;padding:10px;font-size:14px;font-weight:600;cursor:pointer;">Cancel</button>';

        panel.appendChild(header);
        panel.appendChild(body);
        getFloatingRoot().appendChild(panel);
        makeDraggable(panel, header);

        // Pre-fill name/email from cookie
        var savedS = getSavedSubmitter();
        if (savedS.name)  panel.querySelector('#wwps-support-name').value  = savedS.name;
        if (savedS.email) panel.querySelector('#wwps-support-email').value = savedS.email;

        function closeSupport() {
            panel.style.setProperty('opacity', '0', 'important');
            setTimeout(function() { panel.style.setProperty('display', 'none', 'important'); }, 150);
        }
        panel.querySelector('#wwps-support-close').addEventListener('click', closeSupport);
        panel.querySelector('#wwps-support-cancel').addEventListener('click', closeSupport);

        panel.querySelector('#wwps-support-submit').addEventListener('click', function () {
            var subject = panel.querySelector('#wwps-support-subject').value.trim();
            var message = panel.querySelector('#wwps-support-message').value.trim();
            var name    = panel.querySelector('#wwps-support-name').value.trim();
            var email   = panel.querySelector('#wwps-support-email').value.trim();
            var errEl   = panel.querySelector('#wwps-support-error');

            errEl.style.display = 'none';
            if (!subject) { panel.querySelector('#wwps-support-subject').style.borderColor = '#DD4D3F'; errEl.textContent = 'Please enter a subject.'; errEl.style.display = 'block'; return; }
            if (!message) { panel.querySelector('#wwps-support-message').style.borderColor = '#DD4D3F'; errEl.textContent = 'Please enter a message.'; errEl.style.display = 'block'; return; }
            if (!name)    { panel.querySelector('#wwps-support-name').style.borderColor    = '#DD4D3F'; errEl.textContent = 'Please enter your name.';    errEl.style.display = 'block'; return; }
            if (!email)   { panel.querySelector('#wwps-support-email').style.borderColor   = '#DD4D3F'; errEl.textContent = 'Please enter your email address.'; errEl.style.display = 'block'; return; }

            var btn = this; btn.disabled = true; btn.textContent = 'Submitting...';

            post('/support', {
                token:        TOKEN,
                subject:      subject,
                message:      message,
                author_name:  name,
                author_email: email,
                page_url:     PAGE_URL,
                page_title:   PAGE_TITLE,
            }).then(function(res) {
                if (res.success) {
                    // Save name/email for future visits
                    saveSubmitter(name, email);
                    var ok = panel.querySelector('#wwps-support-success');
                    ok.style.display = 'block';
                    ok.innerHTML = 'Thank you, ' + escHtml(name) + '! Your ticket <strong>' + escHtml(res.ticket_id) + '</strong> has been submitted. We\'ll be in touch.';
                    panel.querySelector('#wwps-support-subject').value = '';
                    panel.querySelector('#wwps-support-message').value = '';
                    btn.textContent = 'Submitted';
                    setTimeout(closeSupport, 4000);
                } else {
                    btn.disabled = false; btn.textContent = 'Submit Ticket';
                    errEl.textContent = res.error || 'Submission failed. Please try again.';
                    errEl.style.display = 'block';
                }
            }).catch(function() {
                btn.disabled = false; btn.textContent = 'Submit Ticket';
                errEl.textContent = 'Could not reach the server. Check your connection.';
                errEl.style.display = 'block';
            });
        });
    }

    // -------------------------------------------------------------------------
    //  Pin registry — keyed by task.id so openTaskDetail can highlight the dot
    // -------------------------------------------------------------------------
    var pinMap         = {};   // task.id → pin element
    var activePin      = null; // currently highlighted pin
    var activeCardTask = null; // task.id of the currently-open compact card (null if closed)

    function activatePin(taskId, color) {
        // Remove ring from previous active pin
        if (activePin) {
            activePin.style.boxShadow = '0 2px 8px rgba(0,0,0,.3)';
            activePin.style.transform = 'scale(1)';
            activePin.style.zIndex    = '2147483646';
        }
        var pin = pinMap[taskId];
        if (!pin) return;
        // Double-ring: white inner, priority-color outer
        pin.style.boxShadow = '0 0 0 3px #fff, 0 0 0 7px ' + (color || '#e94560') + ', 0 2px 16px rgba(0,0,0,.4)';
        pin.style.transform = 'scale(1.25)';
        pin.style.zIndex    = '2147483647';
        activePin = pin;
        // Quick pulse: scale up then settle
        setTimeout(function(){ if (activePin === pin) pin.style.transform = 'scale(1.15)'; }, 150);
    }

    function deactivatePin() {
        if (activePin) {
            activePin.style.boxShadow = '0 2px 8px rgba(0,0,0,.3)';
            activePin.style.transform = 'scale(1)';
            activePin.style.zIndex    = '2147483646';
            activePin = null;
        }
    }

    // -------------------------------------------------------------------------
    //  Compact task card — shown when a pin is clicked directly (not via list)
    // -------------------------------------------------------------------------
    function showTaskCard(task, num) {
        var floatRoot = getFloatingRoot();
        // Remove any existing card (different task)
        var existing = document.getElementById('wwps-task-card');
        if (existing) { existing.remove(); clearElementHighlight(); deactivatePin(); }
        activeCardTask = task.id;

        // Activate pin ring + element outline
        activatePin(task.id, PRIORITY_COLORS[task.priority] || COLORS.red);
        clearElementHighlight();
        var targetEl = null;
        if (task.element_selector) {
            try { targetEl = document.querySelector(task.element_selector); } catch(e) {}
        }
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            window._wwpsHighlightOrig = targetEl.style.outline || '';
            window._wwpsHighlightEl   = targetEl;
            targetEl.style.outline       = '3px solid ' + (PRIORITY_COLORS[task.priority] || COLORS.red);
            targetEl.style.outlineOffset = '4px';
        } else if (task.scroll_percent !== undefined && task.scroll_percent !== null) {
            // Selector didn't match — page changed since the comment was made.
            // Fall back to a pulsing dashed-circle marker at the original
            // (viewport_x_percent, scroll_percent) coords the client's browser
            // captured, so the dev still sees WHERE the comment was placed.
            var docH2 = Math.max(document.body.scrollHeight, 1);
            var markerY = Math.max(0, (task.scroll_percent / 100) * docH2);
            window.scrollTo({ top: Math.max(0, markerY - window.innerHeight / 2), behavior: 'smooth' });

            // Inject keyframes once
            if (!document.getElementById('wwps-fallback-style')) {
                var st = document.createElement('style');
                st.id = 'wwps-fallback-style';
                st.textContent = '@keyframes wwpsFallbackPulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1}50%{transform:translate(-50%,-50%) scale(1.25);opacity:.55}}';
                document.head.appendChild(st);
            }

            // Remove any previous marker before drawing the new one
            var prev = document.getElementById('wwps-fallback-marker');
            if (prev) prev.remove();

            var prioCol = PRIORITY_COLORS[task.priority] || COLORS.red;
            var xPct = (task.viewport_x_percent !== undefined && task.viewport_x_percent !== null) ? task.viewport_x_percent : 50;
            var marker = document.createElement('div');
            marker.id = 'wwps-fallback-marker';
            marker.title = "Original element could not be located — marker shows the position when the comment was made.";
            var ms = marker.style;
            ms.setProperty('position',      'absolute',                              'important');
            ms.setProperty('top',           markerY + 'px',                          'important');
            ms.setProperty('left',          xPct + '%',                              'important');
            ms.setProperty('width',         '64px',                                  'important');
            ms.setProperty('height',        '64px',                                  'important');
            ms.setProperty('border',        '4px dashed ' + prioCol,                 'important');
            ms.setProperty('border-radius', '50%',                                   'important');
            ms.setProperty('background',    'rgba(255,255,255,.08)',                 'important');
            ms.setProperty('z-index',       '2147483645',                            'important');
            ms.setProperty('pointer-events','none',                                  'important');
            ms.setProperty('transform',     'translate(-50%,-50%)',                  'important');
            ms.setProperty('box-shadow',    '0 0 32px ' + prioCol + ', inset 0 0 16px ' + prioCol, 'important');
            ms.setProperty('animation',     'wwpsFallbackPulse 1.5s ease-in-out infinite', 'important');
            document.body.appendChild(marker);
            window._wwpsFallbackMarker = marker;
        }

        var prioColor = PRIORITY_COLORS[task.priority] || COLORS.red;
        var commentText = task.comment.length > 200 ? task.comment.substring(0, 200) + '…' : task.comment;

        var card = document.createElement('div');
        card.id = 'wwps-task-card';
        var cs = card.style;
        cs.setProperty('position',       'absolute',      'important');
        cs.setProperty('bottom',         '80px',          'important');
        cs.setProperty('left',           '50%',           'important');
        cs.setProperty('transform',      'translateX(-50%) translateY(12px)', 'important');
        cs.setProperty('width',          '420px',         'important');
        cs.setProperty('max-width',      'calc(100vw - 32px)', 'important');
        cs.setProperty('background',     COLORS.white,    'important');
        cs.setProperty('border-radius',  '10px',          'important');
        cs.setProperty('box-shadow',     '0 8px 40px rgba(0,0,0,.35)', 'important');
        cs.setProperty('border',         '1px solid rgba(0,0,0,.10)', 'important');
        cs.setProperty('font-family',    'system-ui,sans-serif', 'important');
        cs.setProperty('font-size',      '14px',          'important');
        cs.setProperty('overflow',       'hidden',        'important');
        cs.setProperty('opacity',        '0',             'important');
        cs.setProperty('transition',     'opacity .15s, transform .15s', 'important');
        cs.setProperty('pointer-events', 'auto',          'important');

        // Fade in
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                card.style.setProperty('opacity',   '1',                   'important');
                card.style.setProperty('transform', 'translateX(-50%)',    'important');
            });
        });

        card.innerHTML =
            // Header bar
            '<div style="background:' + prioColor + ';color:#fff;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;">' +
                '<div style="display:flex;align-items:center;gap:8px;">' +
                    '<span style="background:rgba(255,255,255,.25);width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">' + num + '</span>' +
                    '<code style="font-size:11px;opacity:.9;">' + escHtml(task.ticket_id) + '</code>' +
                    '<span style="background:rgba(255,255,255,.2);color:#fff;padding:2px 8px;border-radius:8px;font-size:11px;font-weight:600;text-transform:capitalize;">' + task.priority + '</span>' +
                '</div>' +
                '<button id="wwps-card-close" style="background:rgba(255,255,255,.15);border:none;color:#fff;width:24px;height:24px;border-radius:50%;font-size:14px;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center;">&#x2715;</button>' +
            '</div>' +
            // Body
            '<div style="padding:14px 16px;">' +
                '<div style="background:' + COLORS.light + ';border-left:3px solid ' + prioColor + ';padding:10px 14px;border-radius:0 4px 4px 0;margin-bottom:12px;line-height:1.5;">' +
                    escHtml(commentText) +
                '</div>' +
                '<div style="display:flex;gap:12px;font-size:12px;color:' + COLORS.gray + ';margin-bottom:14px;">' +
                    '<span>&#128100; ' + escHtml(task.author_name || 'Anonymous') + '</span>' +
                    '<span>&#9654; <code>' + escHtml(task.element_tag || '?') + '</code></span>' +
                    (targetEl ? '<span style="color:' + COLORS.green + ';">&#10003; Located</span>' : '<span style="color:' + COLORS.orange + ';">&#9888; Approx.</span>') +
                '</div>' +
                '<div style="display:flex;gap:8px;">' +
                    '<button id="wwps-card-complete" style="flex:1;background:' + COLORS.green + ';color:#fff;border:none;border-radius:5px;padding:9px;font-size:13px;font-weight:600;cursor:pointer;">&#10003; Complete</button>' +
                    '<button id="wwps-card-detail" style="flex:2;background:' + COLORS.dark + ';color:#fff;border:none;border-radius:5px;padding:9px;font-size:13px;font-weight:600;cursor:pointer;">View Full Detail &#8594;</button>' +
                '</div>' +
            '</div>';

        floatRoot.appendChild(card);

        // Close
        function closeCard() {
            clearElementHighlight();
            deactivatePin();
            activeCardTask = null;
            card.remove();
        }
        card.querySelector('#wwps-card-close').addEventListener('click', closeCard);

        // Complete
        card.querySelector('#wwps-card-complete').addEventListener('click', function() {
            var btn = this; btn.disabled = true; btn.textContent = 'Completing…';
            completeTask(task.id, function(success) {
                if (success) {
                    clearElementHighlight();
                    deactivatePin();
                    activeCardTask = null;
                    card.remove();
                } else {
                    btn.disabled = false; btn.textContent = '✓ Complete';
                }
            });
        });

        // View Full Detail — close card, open detail panel
        card.querySelector('#wwps-card-detail').addEventListener('click', function() {
            activeCardTask = null;
            card.remove(); // remove card first (don't clear highlight — openTaskDetail will re-apply)
            openTaskDetail(task, num);
        });
    }

    function placePins(tasks) {
        tasks.forEach(function(task, index) {
            var anchorEl = null;
            try { anchorEl = document.querySelector(task.element_selector); } catch(e) {}

            var pin = mkEl('div', {
                position:   anchorEl ? 'absolute' : 'absolute',
                zIndex:     '2147483646',
                width:      '26px', height: '26px', borderRadius: '50%',
                background: PRIORITY_COLORS[task.priority] || COLORS.red,
                color:      '#fff', fontSize: '11px', fontWeight: '700',
                display:    'flex', alignItems: 'center', justifyContent: 'center',
                cursor:     'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.3)',
                fontFamily: 'system-ui,sans-serif',
                border:     '2px solid #fff',
                transition: 'transform .15s, box-shadow .15s',
            });
            pin.setAttribute('data-task-id', task.id);
            pin.setAttribute('title', '#' + (index + 1) + ' — ' + (task.element_tag || '') + (task.element_text_before ? ': "…' + task.element_text_before + '…"' : ''));
            pin.textContent = String(index + 1);

            // Store in registry
            pinMap[task.id] = pin;

            if (anchorEl) {
                anchorEl.style.position = 'relative';
                anchorEl.appendChild(pin);
                pin.style.top      = '-13px';
                pin.style.right    = '-13px';
                pin.style.position = 'absolute';
            } else {
                var docH = Math.max(document.body.scrollHeight, 1);
                pin.style.top      = ((task.scroll_percent / 100) * docH) + 'px';
                pin.style.right    = '60px';
                pin.style.position = 'absolute';
                document.body.appendChild(pin);
            }

            pin.addEventListener('mouseenter', function(){ if (activePin !== pin) pin.style.transform = 'scale(1.2)'; });
            pin.addEventListener('mouseleave', function(){ if (activePin !== pin) pin.style.transform = 'scale(1)'; });
            // When the pin sits inside an <a> or <button>, the browser will
            // still fire that element's default action (navigate / submit)
            // after our click handler runs unless we explicitly preventDefault.
            // mousedown is suppressed too so the link doesn't even get focus.
            pin.addEventListener('mousedown', function(e){ e.preventDefault(); e.stopPropagation(); });
            pin.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // Toggle: if this pin's card is already open, close it
                var existing = document.getElementById('wwps-task-card');
                if (existing && activeCardTask === task.id) {
                    clearElementHighlight();
                    deactivatePin();
                    existing.remove();
                    activeCardTask = null;
                } else {
                    showTaskCard(task, index + 1);
                }
            });
        });
    }

    function buildTaskListPanel(tasks) {
        var floatRoot = getFloatingRoot();

        // ── Floating, draggable panel ─────────────────────────────────────────
        // position:absolute inside the fixed floatRoot ≡ position:fixed on viewport
        var panel = document.createElement('div');
        panel.id = 'wwps-task-panel';
        var ps = panel.style;
        ps.setProperty('position',        'absolute',   'important');
        ps.setProperty('top',             '80px',       'important');
        ps.setProperty('right',           '8px',        'important');
        ps.setProperty('left',            'auto',       'important');
        ps.setProperty('width',           '360px',      'important');
        ps.setProperty('max-height',      'calc(100vh - 120px)', 'important');
        ps.setProperty('background',      'rgba(255,255,255,0.85)', 'important');
        ps.setProperty('backdrop-filter', 'blur(12px)', 'important');
        ps.setProperty('-webkit-backdrop-filter', 'blur(12px)', 'important');
        ps.setProperty('border-radius',   '8px',        'important');
        ps.setProperty('box-shadow',      '0 8px 32px rgba(0,0,0,.35), 0 2px 8px rgba(0,0,0,.18)', 'important');
        ps.setProperty('border',          '1px solid rgba(0,0,0,.12)', 'important');
        ps.setProperty('display',         'none',       'important');
        ps.setProperty('flex-direction',  'column',     'important');
        ps.setProperty('font-family',     'system-ui,sans-serif', 'important');
        ps.setProperty('font-size',       '14px',       'important');
        ps.setProperty('overflow',        'hidden',     'important');
        ps.setProperty('transition',      'opacity .15s, transform .15s', 'important');
        ps.setProperty('transform-origin','top right',  'important');
        ps.setProperty('user-select',     'none',       'important');
        ps.setProperty('pointer-events',  'auto',       'important');

        // ── Header (drag handle) ──────────────────────────────────────────────
        var header = mkEl('div', {
            background:  COLORS.dark,
            color:       '#fff',
            display:     'flex',
            alignItems:  'center',
            padding:     '11px 14px',
            gap:         '10px',
            cursor:      'grab',
            flexShrink:  '0',
            borderRadius:'6px 6px 0 0',
        });
        header.innerHTML =
            // grip dots
            '<svg width="10" height="16" viewBox="0 0 10 16" fill="rgba(255,255,255,.4)" style="flex-shrink:0;">' +
                '<circle cx="3" cy="3"  r="1.5"/><circle cx="7" cy="3"  r="1.5"/>' +
                '<circle cx="3" cy="8"  r="1.5"/><circle cx="7" cy="8"  r="1.5"/>' +
                '<circle cx="3" cy="13" r="1.5"/><circle cx="7" cy="13" r="1.5"/>' +
            '</svg>' +
            '<strong style="flex:1;font-size:13px;">Open Tasks (' + tasks.length + ')</strong>' +
            '<button id="wwps-taskpanel-close" style="background:rgba(255,255,255,.15);border:none;color:#fff;' +
                'width:22px;height:22px;border-radius:50%;font-size:13px;cursor:pointer;' +
                'display:flex;align-items:center;justify-content:center;line-height:1;flex-shrink:0;">&#x2715;</button>';

        // ── Scrollable task list ──────────────────────────────────────────────
        var listWrap = mkEl('div', {
            overflowY:  'auto',
            padding:    '10px',
            flex:       '1',
            background: 'transparent',
        });

        tasks.forEach(function(task, i) {
            var comment = task.comment.length > 100 ? task.comment.substring(0, 100) + '...' : task.comment;
            var card = mkEl('div', {
                background:    '#ffffff',
                border:        '1px solid ' + COLORS.border,
                borderRadius:  '5px',
                marginBottom:  '10px',
                overflow:      'hidden',
                cursor:        'pointer',
                transition:    'border-color .15s, box-shadow .15s',
            });
            card.setAttribute('data-row-id', task.id);
            card.innerHTML =
                '<div style="padding:10px 12px;border-left:3px solid ' + (PRIORITY_COLORS[task.priority] || COLORS.red) + ';background:' + COLORS.light + ';">' +
                    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
                        '<span style="background:' + (PRIORITY_COLORS[task.priority] || COLORS.red) + ';color:#fff;width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">' + (i + 1) + '</span>' +
                        '<code style="font-size:11px;color:' + COLORS.gray + ';">' + escHtml(task.ticket_id) + '</code>' +
                        '<span style="background:' + (PRIORITY_COLORS[task.priority] || COLORS.red) + ';color:#fff;padding:1px 7px;border-radius:8px;font-size:10px;font-weight:600;">' + task.priority + '</span>' +
                    '</div>' +
                    '<p style="margin:0 0 4px;font-size:13px;line-height:1.4;">' + escHtml(comment) + '</p>' +
                    '<div style="font-size:11px;color:' + COLORS.gray + ';">' + escHtml(task.author_name) + ' &middot; ' + escHtml(task.element_tag) + '</div>' +
                '</div>' +
                '<div style="padding:6px 10px;display:flex;gap:6px;background:#ffffff;">' +
                    '<button class="wwps-complete-btn" data-taskid="' + task.id + '" style="background:' + COLORS.green + ';color:#fff;border:none;border-radius:3px;padding:4px 10px;font-size:12px;cursor:pointer;">Complete</button>' +
                    '<button class="wwps-detail-btn"   data-taskid="' + task.id + '" style="background:' + COLORS.border + ';color:' + COLORS.dark + ';border:none;border-radius:3px;padding:4px 10px;font-size:12px;cursor:pointer;">Detail</button>' +
                '</div>';
            listWrap.appendChild(card);
        });

        panel.appendChild(header);
        panel.appendChild(listWrap);
        floatRoot.appendChild(panel);

        // ── Close button ──────────────────────────────────────────────────────
        panel.querySelector('#wwps-taskpanel-close').addEventListener('click', function(e) {
            e.stopPropagation();
            panel.style.setProperty('opacity',   '0',          'important');
            panel.style.setProperty('transform', 'scale(0.95)','important');
            setTimeout(function() { panel.style.setProperty('display', 'none', 'important'); }, 150);
        });

        // ── Card button events (Complete / Detail) ────────────────────────────
        listWrap.addEventListener('click', function(e) {
            var completeBtn = e.target.closest('.wwps-complete-btn');
            var detailBtn   = e.target.closest('.wwps-detail-btn');
            var card        = e.target.closest('[data-row-id]');

            if (completeBtn) {
                e.stopPropagation();
                completeTask(parseInt(completeBtn.getAttribute('data-taskid'), 10), null);
                return;
            }
            if (detailBtn) {
                e.stopPropagation();
                var tid = parseInt(detailBtn.getAttribute('data-taskid'), 10);
                if (window['wwpsOpenTask_' + tid]) window['wwpsOpenTask_' + tid]();
                return;
            }
            if (card) {
                var tid = parseInt(card.getAttribute('data-row-id'), 10);
                if (window['wwpsOpenTask_' + tid]) window['wwpsOpenTask_' + tid]();
            }
        });

        // ── Drag logic ────────────────────────────────────────────────────────
        var dragging = false, dragOffX = 0, dragOffY = 0;

        header.addEventListener('mousedown', function(e) {
            if (e.target.closest('#wwps-taskpanel-close')) return;
            dragging = true;
            var rect = panel.getBoundingClientRect();
            // Convert right-anchor to left-anchor for drag arithmetic
            panel.style.setProperty('left',  rect.left + 'px', 'important');
            panel.style.setProperty('right', 'auto',           'important');
            dragOffX = e.clientX - rect.left;
            dragOffY = e.clientY - rect.top;
            header.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!dragging) return;
            var x = Math.max(8, Math.min(e.clientX - dragOffX, window.innerWidth  - panel.offsetWidth  - 8));
            var y = Math.max(8, Math.min(e.clientY - dragOffY, window.innerHeight - 60));
            panel.style.setProperty('left', x + 'px', 'important');
            panel.style.setProperty('top',  y + 'px', 'important');
        });

        document.addEventListener('mouseup', function() {
            if (dragging) { dragging = false; header.style.cursor = 'grab'; }
        });

        // ── wwpsOpenTask_ / wwpsComplete_ globals ─────────────────────────────
        tasks.forEach(function(task, i) {
            window['wwpsOpenTask_' + task.id] = function() {
                // Highlight active row
                listWrap.querySelectorAll('[data-row-id]').forEach(function(r) {
                    r.style.background  = '#ffffff';
                    r.style.borderColor = COLORS.border;
                });
                var row = listWrap.querySelector('[data-row-id="' + task.id + '"]');
                if (row) {
                    row.style.background  = '#fffbeb';
                    row.style.borderColor = PRIORITY_COLORS[task.priority] || COLORS.red;
                }
                openTaskDetail(task, i + 1);
            };
            window['wwpsComplete_' + task.id] = function() { completeTask(task.id, null); };
        });
    }

    function clearElementHighlight() {
        if (window._wwpsHighlightEl) {
            window._wwpsHighlightEl.style.outline       = window._wwpsHighlightOrig || '';
            window._wwpsHighlightEl.style.outlineOffset = '';
            window._wwpsHighlightEl = null;
        }
        // Remove the fallback "selector-missed" marker if present
        if (window._wwpsFallbackMarker) {
            try { window._wwpsFallbackMarker.remove(); } catch(e) {}
            window._wwpsFallbackMarker = null;
        } else {
            var stray = document.getElementById('wwps-fallback-marker');
            if (stray) stray.remove();
        }
    }

    function openTaskDetail(task, num) {
        var existing = document.getElementById('wwps-detail-panel');
        if (existing) existing.remove();

        // Activate pin ring + element outline
        activatePin(task.id, PRIORITY_COLORS[task.priority] || COLORS.red);
        clearElementHighlight();

        var targetEl = null;
        if (task.element_selector) {
            try { targetEl = document.querySelector(task.element_selector); } catch(e) {}
        }
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            window._wwpsHighlightOrig    = targetEl.style.outline || '';
            window._wwpsHighlightEl      = targetEl;
            targetEl.style.outline       = '3px solid ' + (PRIORITY_COLORS[task.priority] || COLORS.red);
            targetEl.style.outlineOffset = '4px';
        } else if (task.scroll_percent) {
            var docH = Math.max(document.body.scrollHeight, 1);
            window.scrollTo({ top: Math.max(0, (task.scroll_percent / 100) * docH - 200), behavior: 'smooth' });
        }

        var prioColor = PRIORITY_COLORS[task.priority] || COLORS.red;
        var floatRoot = getFloatingRoot();

        // ── Floating panel — opens left side, inside the fixed floatRoot ─────
        var panel = document.createElement('div');
        panel.id = 'wwps-detail-panel';
        var dp = panel.style;
        dp.setProperty('position',        'absolute',   'important');
        dp.setProperty('top',             '80px',       'important');
        dp.setProperty('left',            '20px',       'important');
        dp.setProperty('width',           '370px',      'important');
        dp.setProperty('max-height',      'calc(100vh - 120px)', 'important');
        dp.setProperty('background',      'rgba(255,255,255,0.90)', 'important');
        dp.setProperty('backdrop-filter', 'blur(12px)', 'important');
        dp.setProperty('-webkit-backdrop-filter', 'blur(12px)', 'important');
        dp.setProperty('border-radius',   '8px',        'important');
        dp.setProperty('box-shadow',      '0 8px 32px rgba(0,0,0,.35), 0 2px 8px rgba(0,0,0,.18)', 'important');
        dp.setProperty('border',          '1px solid rgba(0,0,0,.12)', 'important');
        dp.setProperty('display',         'flex',       'important');
        dp.setProperty('flex-direction',  'column',     'important');
        dp.setProperty('font-family',     'system-ui,sans-serif', 'important');
        dp.setProperty('font-size',       '14px',       'important');
        dp.setProperty('overflow',        'hidden',     'important');
        dp.setProperty('opacity',         '0',          'important');
        dp.setProperty('transform',       'scale(0.95)','important');
        dp.setProperty('transition',      'opacity .15s, transform .15s', 'important');
        dp.setProperty('transform-origin','top left',   'important');
        // Allow text selection inside the detail panel so the team can
        // copy the client's feedback into emails / replies. The drag
        // handle header sets its OWN inline user-select:none so drag
        // clicks won't select header text.
        dp.setProperty('user-select',     'text',       'important');
        dp.setProperty('pointer-events',  'auto',       'important');

        // Fade in (double RAF so first paint registers opacity:0 before animating to 1)
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                panel.style.setProperty('opacity',   '1',       'important');
                panel.style.setProperty('transform', 'scale(1)','important');
            });
        });

        // ── Draggable header ──────────────────────────────────────────────────
        var dHeader = mkEl('div', {
            background:   COLORS.dark,
            color:        '#fff',
            display:      'flex',
            alignItems:   'center',
            padding:      '11px 14px',
            gap:          '10px',
            cursor:       'grab',
            flexShrink:   '0',
            borderRadius: '6px 6px 0 0',
        });
        dHeader.innerHTML =
            '<svg width="10" height="16" viewBox="0 0 10 16" fill="rgba(255,255,255,.4)" style="flex-shrink:0;">' +
                '<circle cx="3" cy="3"  r="1.5"/><circle cx="7" cy="3"  r="1.5"/>' +
                '<circle cx="3" cy="8"  r="1.5"/><circle cx="7" cy="8"  r="1.5"/>' +
                '<circle cx="3" cy="13" r="1.5"/><circle cx="7" cy="13" r="1.5"/>' +
            '</svg>' +
            '<strong style="flex:1;font-size:13px;">Task #' + num + ' &middot; ' + escHtml(task.ticket_id) + '</strong>' +
            '<span style="background:' + prioColor + ';color:#fff;padding:2px 8px;border-radius:8px;font-size:11px;font-weight:600;flex-shrink:0;text-transform:capitalize;">' + task.priority + '</span>' +
            '<button id="wwps-detail-close" style="background:rgba(255,255,255,.15);border:none;color:#fff;' +
                'width:22px;height:22px;border-radius:50%;font-size:13px;cursor:pointer;' +
                'display:flex;align-items:center;justify-content:center;line-height:1;flex-shrink:0;margin-left:4px;">&#x2715;</button>';

        // ── Scrollable content ────────────────────────────────────────────────
        var emailStr  = task.author_email ? ' &lt;' + escHtml(task.author_email) + '&gt;' : '';
        var imageHtml = task.image_url
            ? '<div style="margin-bottom:12px;">' +
                  '<div style="font-weight:600;font-size:11px;margin-bottom:5px;color:' + COLORS.gray + ';text-transform:uppercase;letter-spacing:.5px;">Attached Image</div>' +
                  '<a href="' + escHtml(task.image_url) + '" target="_blank" rel="noopener">' +
                      '<img src="' + escHtml(task.image_url) + '" style="max-width:100%;border-radius:4px;border:1px solid ' + COLORS.border + ';display:block;">' +
                  '</a>' +
              '</div>'
            : '';

        var locationHtml = targetEl
            ? '<span style="color:' + COLORS.green + ';font-size:12px;">&#10003; Element highlighted on page</span>'
            : '<span style="color:' + COLORS.orange + ';font-size:12px;">&#9888; ~' + task.scroll_percent + '% down the page</span>';

        var contextHtml = '';
        if (task.element_text_before || task.element_text_after) {
            var before = task.element_text_before ? escHtml(task.element_text_before) + ' ' : '';
            var after  = task.element_text_after  ? ' ' + escHtml(task.element_text_after) : '';
            contextHtml =
                '<div style="margin-bottom:12px;">' +
                    '<div style="font-weight:600;font-size:11px;margin-bottom:5px;color:' + COLORS.gray + ';text-transform:uppercase;letter-spacing:.5px;">Surrounding Text</div>' +
                    '<div style="background:#fffbeb;border:1px solid #f6e05e;border-radius:4px;padding:9px 12px;font-size:12px;line-height:1.6;color:#744210;">' +
                        '...' + before +
                        '<mark style="background:#fef08a;padding:1px 4px;border-radius:2px;font-weight:600;">[annotated here]</mark>' +
                        after + '...' +
                    '</div>' +
                '</div>';
        }

        var scrollBody = mkEl('div', { overflowY: 'auto', flex: '1', padding: '10px', background: 'transparent' });

        // Opaque white content card — all task info lives here
        var contentCard = mkEl('div', { background: '#ffffff', borderRadius: '5px', padding: '14px' });
        // Re-assert text selection on the content card itself so any
        // future style rule on a child can't silently disable it.
        contentCard.style.setProperty('user-select', 'text', 'important');
        contentCard.style.setProperty('-webkit-user-select', 'text', 'important');
        contentCard.innerHTML =
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">' +
                locationHtml +
            '</div>' +
            '<div style="margin-bottom:12px;">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">' +
                    '<div style="font-weight:600;font-size:11px;color:' + COLORS.gray + ';text-transform:uppercase;letter-spacing:.5px;">Feedback</div>' +
                    '<button id="wwps-copy-feedback" type="button" style="background:transparent;border:1px solid ' + COLORS.border + ';color:' + COLORS.gray + ';font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;padding:3px 8px;border-radius:3px;cursor:pointer;line-height:1;">Copy</button>' +
                '</div>' +
                '<div style="background:' + COLORS.light + ';border-left:3px solid ' + prioColor + ';padding:10px 14px;border-radius:0 4px 4px 0;max-height:200px;overflow-y:auto;">' +
                    '<p id="wwps-feedback-text" style="margin:0;line-height:1.5;white-space:pre-wrap;word-wrap:break-word;overflow-wrap:break-word;user-select:text;-webkit-user-select:text;cursor:text;">' + escHtml(task.comment) + '</p>' +
                '</div>' +
            '</div>' +
            imageHtml +
            contextHtml +
            '<table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:12px;">' +
                '<tr><td style="padding:4px 0;font-weight:600;width:80px;color:' + COLORS.gray + ';">From</td><td style="padding:4px 0;border-bottom:1px solid ' + COLORS.border + ';">' + escHtml(task.author_name) + emailStr + '</td></tr>' +
                '<tr><td style="padding:4px 0;font-weight:600;color:' + COLORS.gray + ';">Element</td><td style="padding:4px 0;border-bottom:1px solid ' + COLORS.border + ';"><code style="font-size:11px;">' + escHtml(task.element_tag) + '</code></td></tr>' +
                '<tr><td style="padding:4px 0;font-weight:600;color:' + COLORS.gray + ';">Device</td><td style="padding:4px 0;border-bottom:1px solid ' + COLORS.border + ';">' + escHtml(task.device_type) + ' &middot; ' + escHtml(task.browser) + ' &middot; ' + task.viewport_width + 'px</td></tr>' +
                '<tr><td style="padding:4px 0;font-weight:600;color:' + COLORS.gray + ';">Submitted</td><td style="padding:4px 0;">' + escHtml(task.created_at) + '</td></tr>' +
            '</table>' +
            '<div id="wwps-detail-success" style="display:none;background:#d4edda;border:1px solid #c3e6cb;color:#155724;padding:9px 12px;border-radius:4px;margin-bottom:10px;"></div>' +
            '<div style="margin-bottom:10px;">' +
                '<label style="display:block;font-size:11px;font-weight:700;color:' + COLORS.gray + ';text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;">Change Status</label>' +
                '<select id="wwps-detail-status" style="width:100%;padding:8px 10px;border:1px solid ' + COLORS.border + ';border-radius:4px;font-size:13px;background:#fff;cursor:pointer;">' +
                    '<option value="open"' +      (task.status === 'open'      ? ' selected' : '') + '>Open</option>' +
                    '<option value="completed"' + (task.status === 'completed' ? ' selected' : '') + '>Completed</option>' +
                    '<option value="on_hold"' +   (task.status === 'on_hold'   ? ' selected' : '') + '>On Hold</option>' +
                    '<option value="wont_fix"' +  (task.status === 'wont_fix'  ? ' selected' : '') + '>Won\'t Fix</option>' +
                '</select>' +
            '</div>' +
            '<button id="wwps-detail-complete" style="width:100%;background:' + COLORS.green + ';color:#fff;border:none;border-radius:4px;padding:10px;font-size:14px;font-weight:600;cursor:pointer;">Mark Complete</button>';

        scrollBody.appendChild(contentCard);
        panel.appendChild(dHeader);
        panel.appendChild(scrollBody);
        floatRoot.appendChild(panel);

        // ---- Close ----
        function closeDetail() {
            document.removeEventListener('mousemove', onDetailMove);
            document.removeEventListener('mouseup',   onDetailUp);
            clearElementHighlight();
            deactivatePin();
            panel.remove();
        }
        panel.querySelector('#wwps-detail-close').addEventListener('click', closeDetail);

        // ---- Copy feedback text ----
        // One-click copy of the client's comment so the team can paste it
        // into emails / replies without highlighting + Ctrl+C.
        var copyBtn = panel.querySelector('#wwps-copy-feedback');
        if (copyBtn) {
            copyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                var src = (task && task.comment) ? String(task.comment) : '';
                var flash = function() {
                    var orig       = copyBtn.textContent;
                    var origBg     = copyBtn.style.background;
                    var origBorder = copyBtn.style.borderColor;
                    var origColor  = copyBtn.style.color;
                    copyBtn.textContent = 'Copied!';
                    copyBtn.style.background = COLORS.green || '#28a745';
                    copyBtn.style.color = '#fff';
                    copyBtn.style.borderColor = COLORS.green || '#28a745';
                    setTimeout(function() {
                        copyBtn.textContent = orig;
                        copyBtn.style.background = origBg;
                        copyBtn.style.color = origColor;
                        copyBtn.style.borderColor = origBorder;
                    }, 1500);
                };
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(src).then(flash, legacyCopy);
                } else {
                    legacyCopy();
                }
                function legacyCopy() {
                    var ta = document.createElement('textarea');
                    ta.value = src;
                    ta.style.position = 'fixed';
                    ta.style.left = '-9999px';
                    document.body.appendChild(ta);
                    ta.select();
                    try { document.execCommand('copy'); flash(); } catch (_) {}
                    document.body.removeChild(ta);
                }
            });
        }

        // ---- Complete ----
        panel.querySelector('#wwps-detail-complete').addEventListener('click', function() {
            var btn = this; btn.disabled = true; btn.textContent = 'Completing...';
            completeTask(task.id, function(success) {
                if (success) {
                    clearElementHighlight();
                    deactivatePin();
                    var ok = panel.querySelector('#wwps-detail-success');
                    ok.style.display = 'block';
                    ok.textContent   = 'Task marked complete!';
                    btn.textContent  = 'Completed';
                    setTimeout(function() { panel.remove(); }, 2000);
                } else {
                    btn.disabled = false; btn.textContent = 'Mark Complete';
                }
            });
        });

        // ---- Status dropdown ----
        panel.querySelector('#wwps-detail-status').addEventListener('change', function() {
            var newStatus = this.value;
            var $sel = this;
            $sel.disabled = true;
            var ok = panel.querySelector('#wwps-detail-success');
            post('/update-status', { token: TOKEN, task_id: task.id, status: newStatus })
                .then(function(res) {
                    $sel.disabled = false;
                    if (res.success) {
                        ok.style.display = 'block';
                        ok.textContent   = 'Status updated to: ' + newStatus.replace('_', ' ');
                        task.status = newStatus;
                        // If completed via dropdown, also turn pin green
                        if (newStatus === 'completed') completeTask(task.id, null);
                        setTimeout(function() { ok.style.display = 'none'; }, 3000);
                    } else {
                        ok.style.background = '#f8d7da';
                        ok.style.borderColor = '#f5c6cb';
                        ok.style.color = '#721c24';
                        ok.style.display = 'block';
                        ok.textContent = 'Error updating status.';
                        setTimeout(function() { ok.style.display = 'none'; ok.style.background='#d4edda'; ok.style.borderColor='#c3e6cb'; ok.style.color='#155724'; }, 3000);
                    }
                });
        });

        // ---- Drag ----
        var dDragging = false, dDragOffX = 0, dDragOffY = 0;

        dHeader.addEventListener('mousedown', function(e) {
            if (e.target.closest('#wwps-detail-close')) return;
            dDragging = true;
            var rect  = panel.getBoundingClientRect();
            dDragOffX = e.clientX - rect.left;
            dDragOffY = e.clientY - rect.top;
            dHeader.style.cursor = 'grabbing';
            e.preventDefault();
        });

        function onDetailMove(e) {
            if (!dDragging) return;
            var x = Math.max(8, Math.min(e.clientX - dDragOffX, window.innerWidth  - panel.offsetWidth  - 8));
            var y = Math.max(8, Math.min(e.clientY - dDragOffY, window.innerHeight - 60));
            panel.style.setProperty('left', x + 'px', 'important');
            panel.style.setProperty('top',  y + 'px', 'important');
        }
        function onDetailUp() {
            if (dDragging) { dDragging = false; dHeader.style.cursor = 'grab'; }
        }
        document.addEventListener('mousemove', onDetailMove);
        document.addEventListener('mouseup',   onDetailUp);
    }

    function completeTask(taskId, callback) {
        post('/complete', { token: TOKEN, task_id: taskId }).then(function(res) {
            if (res.success) {
                // Turn the pin green to show "completed" - stays on page until approved/deleted
                var pin = pinMap[taskId];
                if (pin) {
                    pin.style.background    = COLORS.green;
                    pin.style.border        = '2px solid #fff';
                    pin.style.boxShadow     = '0 2px 8px rgba(56,161,105,.4)';
                    pin.style.transform     = 'scale(1)';
                    pin.style.cursor        = 'default';
                    pin.style.pointerEvents = 'none';
                    pin.textContent         = '\u2713';
                    pin.title               = 'Completed';
                    pin.setAttribute('data-completed', '1');
                    delete pinMap[taskId];
                }
                if (callback) callback(true);
            } else {
                alert('Error completing task.');
                if (callback) callback(false);
            }
        });
    }

    function removeAllPins() {
        // Remove every pin from the page (used on page approval or full clear)
        document.querySelectorAll('[data-task-id]').forEach(function(e){ e.remove(); });
    }

    function escHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

})();
/* WebWize Proof v1.4.5 - floating draggable panels on proof + support sides; support button moved right of Approve Page */
