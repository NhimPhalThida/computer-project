const AUTH_USERS_KEY = 'cp_users';     // list of all "registered" accounts
const AUTH_SESSION_KEY = 'cp_user';    // the currently logged-in user
const uploadImage = document.getElementById("upload-image");
const profileImage = document.getElementById("profile-image");

// ---------- Public helpers ----------
window.getCurrentUser = function () {
  try {
    return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY));
  } catch (e) {
    return null;
  }
};

window.logoutUser = function () {
  localStorage.removeItem(AUTH_SESSION_KEY);
  window.location.reload();
};

// ---------- Dropdown styling (injected once, no style.css edits needed) ----------
function injectDropdownStyles() {
  if (document.getElementById('auth-dropdown-styles')) return;
  const style = document.createElement('style');
  style.id = 'auth-dropdown-styles';
  style.textContent = `
    .profile-dropdown {
      position: fixed;
      width: 240px;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 14px 34px rgba(0,0,0,0.16);
      padding: 18px;
      z-index: 2000;
      display: none;
      font-family: 'Poppins', sans-serif;
    }
    .profile-dropdown.show { display: block; }
    .profile-dropdown .pd-greeting {
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 4px;
      color: #222;
    }
    .profile-dropdown .pd-sub {
      font-size: 0.8rem;
      color: #888;
      margin-bottom: 14px;
      word-break: break-all;
    }
    .profile-dropdown .pd-btn {
      display: block;
      width: 100%;
      text-align: center;
      padding: 10px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      margin-bottom: 10px;
      border: none;
      cursor: pointer;
    }
    .profile-dropdown .pd-btn-solid {
      background: var(--primary-purple, #8b5cf6);
      color: #fff;
    }
    .profile-dropdown .pd-btn-outline {
      background: #fff;
      color: var(--primary-purple, #8b5cf6);
      border: 1.5px solid var(--primary-purple, #8b5cf6);
    }
    .profile-dropdown .pd-btn:last-child { margin-bottom: 0; }
  `;
  document.head.appendChild(style);
}

function buildDropdownContent(container) {
  const user = window.getCurrentUser();
  if (user) {
    container.innerHTML = `
      <div class="pd-greeting">Hi, ${user.name || 'there'} 👋</div>
      <div class="pd-sub">${user.contact || ''}</div>
      <a href="profile.html" class="pd-btn pd-btn-solid">My Profile</a>
      <button type="button" class="pd-btn pd-btn-outline" id="pd-logout-btn">Logout</button>
    `;
    container.querySelector('#pd-logout-btn').addEventListener('click', () => {
      window.logoutUser();
    });
  } else {
    container.innerHTML = `
      <div class="pd-greeting">Welcome</div>
      <div class="pd-sub">Login or create an account</div>
      <a href="login.html" class="pd-btn pd-btn-solid">Login</a>
      <a href="signup.html" class="pd-btn pd-btn-outline">Sign Up</a>
    `;
  }
}

// ---------- Header profile button -> dropdown ----------
function initProfileMenu() {
  const btn = document.getElementById('btn-profile');
  if (!btn) return;

  injectDropdownStyles();

  let dropdown = document.getElementById('profileDropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.id = 'profileDropdown';
    dropdown.className = 'profile-dropdown';
    document.body.appendChild(dropdown);
  }

  function positionDropdown() {
    const rect = btn.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + 10}px`;
    let left = rect.right - 240;
    if (left < 10) left = 10;
    dropdown.style.left = `${left}px`;
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('show');
    if (isOpen) {
      dropdown.classList.remove('show');
      return;
    }
    buildDropdownContent(dropdown);
    positionDropdown();
    dropdown.classList.add('show');
  });

  document.addEventListener('click', (e) => {
    if (dropdown.classList.contains('show') && !dropdown.contains(e.target) && e.target !== btn) {
      dropdown.classList.remove('show');
    }
  });

  window.addEventListener('resize', () => {
    if (dropdown.classList.contains('show')) positionDropdown();
  });
}

// ---------- Form helpers ----------
function showFieldError(elId, msg) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('d-none');
}

function hideFieldError(elId) {
  const el = document.getElementById(elId);
  if (el) el.classList.add('d-none');
}

function showFieldSuccess(elId, msg) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('d-none');
}

function hideFieldSuccess(elId) {
  const el = document.getElementById(elId);
  if (el) el.classList.add('d-none');
}

// ---------- Login form (login.html) ----------
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideFieldError('login-error');

    const phone = document.getElementById('login-phone').value.trim();
    const password = document.getElementById('login-password').value;

    if (!phone || !password) {
      showFieldError('login-error', 'Please fill in both fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '[]');
    const match = users.find(u => (u.phone === phone || u.email === phone) && u.password === password);

    if (!match) {
      showFieldError('login-error', "No matching account found. Check your details, or sign up.");
      return;
    }

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
      name: match.name,
      contact: match.phone || match.email
    }));
    window.location.href = 'index.html';
  });
}

// ---------- Signup form (signup.html) ----------
function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideFieldError('signup-error');

    const name = document.getElementById('signup-name').value.trim();
    const contact = document.getElementById('signup-contact').value.trim();
    const password = document.getElementById('signup-password').value;

    if (!name || !contact || !password) {
      showFieldError('signup-error', 'Please fill in all fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '[]');
    if (users.find(u => (u.phone && u.phone === contact) || (u.email && u.email === contact))) {
      showFieldError('signup-error', 'An account with these details already exists — please login.');
      return;
    }

    const isEmail = contact.includes('@');
    const newUser = {
      name,
      password,
      phone: isEmail ? '' : contact,
      email: isEmail ? contact : ''
    };

    users.push(newUser);
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ name, contact }));
    window.location.href = 'index.html';
  });
}

// ---------- Profile page (profile.html) ----------
function initProfilePage() {
  const form = document.getElementById('profile-form');
  if (!form) return;

  const user = window.getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const originalContact = user.contact || '';

  const nameEl = document.getElementById('profile-name');
  const contactEl = document.getElementById('profile-contact');
  const initialsEl = document.getElementById('profile-initials');

  nameEl.value = user.name || '';
  contactEl.value = originalContact;
  if (initialsEl) {
    initialsEl.textContent = (user.name || '?').trim().charAt(0).toUpperCase();
  }

  const logoutBtn = document.getElementById('profile-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.logoutUser();
      window.location.href = 'login.html';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideFieldError('profile-error');
    hideFieldSuccess('profile-success');

    const name = document.getElementById('profile-name').value.trim();
    const contact = document.getElementById('profile-contact').value.trim();
    const newPassword = document.getElementById('profile-password').value;

    if (!name || !contact) {
      showFieldError('profile-error', 'Name and contact cannot be empty.');
      return;
    }

    const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '[]');
    const idx = users.findIndex(u => u.phone === originalContact || u.email === originalContact);

    const contactTakenByAnother = users.some((u, i) =>
      i !== idx && (u.phone === contact || u.email === contact)
    );
    if (contactTakenByAnother) {
      showFieldError('profile-error', 'That email/phone is already used by another account.');
      return;
    }

    const isEmail = contact.includes('@');
    const updatedRecord = {
      name,
      password: newPassword ? newPassword : (idx > -1 ? users[idx].password : ''),
      phone: isEmail ? '' : contact,
      email: isEmail ? contact : ''
    };

    if (idx > -1) {
      users[idx] = updatedRecord;
    } else {
      users.push(updatedRecord);
    }

    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ name, contact }));

    document.getElementById('profile-password').value = '';
    if (initialsEl) initialsEl.textContent = name.charAt(0).toUpperCase();
    showFieldSuccess('profile-success', 'Profile updated successfully.');
  });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  initProfileMenu();
  initLoginForm();
  initSignupForm();
  initProfilePage();
});

// Load saved picture
const savedImage = localStorage.getItem("profileImage");

if(savedImage){
    profileImage.src = savedImage;
}

uploadImage.addEventListener("change", function(){

    const file = this.files[0];

    if(file){

        const reader = new FileReader();

        reader.onload = function(e){

            profileImage.src = e.target.result;

            // Save to localStorage
            localStorage.setItem("profileImage", e.target.result);

        }

        reader.readAsDataURL(file);

    }

});
