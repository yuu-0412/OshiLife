// =====================================
// OshiLog - script.js
// LocalStorage版
// =====================================

const STORAGE_KEYS = {
    USER: "oshilog_user",
    PROFILE: "oshilog_profile",
    OSHI: "oshilog_oshi",
    SCHEDULE: "oshilog_schedule",
    LOG: "oshilog_log",
    GOODS: "oshilog_goods",
    MONEY: "oshilog_money",
    CATEGORIES: "oshilog_categories"
};


// =====================================
// 共通
// =====================================

function createId() {
    return Date.now().toString(36) +
        Math.random().toString(36).substring(2, 9);
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error("データ保存エラー:", error);
        alert("データを保存できませんでした。");
    }
}

function loadData(key, defaultValue = []) {
    const data = localStorage.getItem(key);

    if (!data) return defaultValue;

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("データ読み込みエラー:", error);
        return defaultValue;
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        function (char) {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return entities[char];
        }
    );
}

function getToday() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatYen(value) {
    return "¥" + Number(value || 0).toLocaleString();
}

function formatDateJapanese(dateString) {
    if (!dateString) return "";

    const parts = dateString.split("-");

    if (parts.length !== 3) {
        return dateString;
    }

    return `${Number(parts[1])}月${Number(parts[2])}日`;
}

function isValidColor(value) {
    return /^#[0-9A-Fa-f]{6}$/.test(value);
}


// =====================================
// LocalStorage
// =====================================

function getOshiList() {
    return loadData(STORAGE_KEYS.OSHI, []);
}

function setOshiList(list) {
    saveData(STORAGE_KEYS.OSHI, list);
}

function getScheduleList() {
    return loadData(STORAGE_KEYS.SCHEDULE, []);
}

function setScheduleList(list) {
    saveData(STORAGE_KEYS.SCHEDULE, list);
}

function getLogList() {
    return loadData(STORAGE_KEYS.LOG, []);
}

function setLogList(list) {
    saveData(STORAGE_KEYS.LOG, list);
}

function getGoodsList() {
    return loadData(STORAGE_KEYS.GOODS, []);
}

function setGoodsList(list) {
    saveData(STORAGE_KEYS.GOODS, list);
}

function getMoneyList() {
    return loadData(STORAGE_KEYS.MONEY, []);
}

function setMoneyList(list) {
    saveData(STORAGE_KEYS.MONEY, list);
}


// =====================================
// プロフィール
// =====================================

function getProfile() {

    const defaultProfile = {
        name: "",
        message: "",
        color: "#ff99cc",
        image: "",
        background: {
            color: "#fff5fb",
            image: "",
            enabled: false
        }
    };

    const data = localStorage.getItem(
        STORAGE_KEYS.PROFILE
    );

    if (!data) {
        return defaultProfile;
    }

    try {

        const profile = JSON.parse(data);

        return {
            ...defaultProfile,
            ...profile,
            background: {
                ...defaultProfile.background,
                ...(profile.background || {})
            }
        };

    } catch (error) {

        console.error(
            "プロフィール読み込みエラー:",
            error
        );

        return defaultProfile;
    }
}

function setProfile(profile) {
    localStorage.setItem(
        STORAGE_KEYS.PROFILE,
        JSON.stringify(profile)
    );
}

function register() {

    const name =
        document.getElementById("register-name")?.value.trim();

    const email =
        document.getElementById("register-email")?.value.trim();

    const password =
        document.getElementById("register-password")?.value;

    const password2 =
        document.getElementById("register-password2")?.value;

    if (!name || !email || !password || !password2) {
        alert("すべての項目を入力してください。");
        return;
    }

    if (password !== password2) {
        alert("パスワードが一致しません。");
        return;
    }

    const existingUser =
        localStorage.getItem(STORAGE_KEYS.USER);

    if (existingUser) {

        if (!confirm(
            "すでにアカウントがあります。上書きしますか？"
        )) {
            return;
        }
    }

    const user = {
        id: createId(),
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(user)
    );

    const profile = getProfile();

    profile.name = name;

    setProfile(profile);

    alert("アカウント登録が完了しました！");

    location.href = "index.html";
}

function login() {

    const email =
        document.getElementById("login-email")?.value.trim();

    const password =
        document.getElementById("login-password")?.value;

    if (!email || !password) {
        alert("メールアドレスとパスワードを入力してください。");
        return;
    }

    const data =
        localStorage.getItem(STORAGE_KEYS.USER);

    if (!data) {
        alert("アカウントが登録されていません。");
        return;
    }

    let user;

    try {

        user = JSON.parse(data);

    } catch (error) {

        alert("アカウント情報を読み込めませんでした。");
        return;
    }

    if (
        user.email !== email ||
        user.password !== password
    ) {

        alert(
            "メールアドレスまたはパスワードが違います。"
        );

        return;
    }

    sessionStorage.setItem(
        "oshilog_login",
        "true"
    );

    alert("ログインしました！");

    location.href = "home.html";
}

function logout() {

    if (!confirm("ログアウトしますか？")) {
        return;
    }

    sessionStorage.removeItem(
        "oshilog_login"
    );

    location.href = "index.html";
}

function checkLogin() {

    const page =
        location.pathname.split("/").pop();

    const publicPages = [
        "",
        "index.html",
        "register.html",
        "login.html"
    ];

    if (publicPages.includes(page)) {
        return true;
    }

    const isLogin =
        sessionStorage.getItem("oshilog_login");

    if (isLogin !== "true") {

        location.href = "index.html";

        return false;
    }

    return true;
}

function saveProfile() {

    const profile = getProfile();

    const name =
        document.getElementById("profile-name");

    const message =
        document.getElementById("profile-message");

    const color =
        document.getElementById("profile-color");

    const preview =
        document.getElementById("preview");

    if (name) {
        profile.name = name.value.trim();
    }

    if (message) {
        profile.message = message.value;
    }

    if (
        color &&
        isValidColor(color.value)
    ) {
        profile.color = color.value;
    }

    if (
        preview &&
        preview.src &&
        !preview.src.includes("default-profile")
    ) {
        profile.image = preview.src;
    }

    setProfile(profile);

    applyProfileColor();
    applySavedAppearance();
    updateProfileIcons();

    alert("プロフィールを保存しました！");
}

function loadProfileSettings() {

    const profile = getProfile();

    const name =
        document.getElementById("profile-name");

    const message =
        document.getElementById("profile-message");

    const color =
        document.getElementById("profile-color");

    const preview =
        document.getElementById("preview");

    if (name) {
        name.value = profile.name || "";
    }

    if (message) {
        message.value = profile.message || "";
    }

    if (color) {
        color.value =
            profile.color || "#ff99cc";
    }

    if (
        preview &&
        profile.image
    ) {
        preview.src = profile.image;
    }

    loadBackgroundSettings();
}


function updateProfileIcons() {
    const profile = getProfile();

    const images = document.querySelectorAll(
        "#homeProfile, .profile-icon, .profile-image, #profile-display-image"
    );

    images.forEach(function (image) {
        if (profile.image) {
            image.src = profile.image;
        } else {
            image.src = "../images/default-profile.png";
        }
    });
}

function saveProfileImageFile(input) {

    if (
        !input ||
        !input.files ||
        !input.files[0]
    ) {
        return;
    }

    const file = input.files[0];

    if (!file.type.startsWith("image/")) {

        alert("画像ファイルを選択してください.");

        input.value = "";

        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        const profile = getProfile();

        profile.image =
            event.target.result;

        setProfile(profile);

        const preview =
            document.getElementById("preview");

        if (preview) {
            preview.src =
                event.target.result;
        }

        updateProfileIcons();
    };

    reader.readAsDataURL(file);
}

function saveBackgroundImageFile(input) {

    if (
        !input ||
        !input.files ||
        !input.files[0]
    ) {
        return;
    }

    const file = input.files[0];

    if (!file.type.startsWith("image/")) {

        alert("画像ファイルを選択してください。");

        input.value = "";

        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        const profile = getProfile();

        profile.background.image =
            event.target.result;

        profile.background.enabled = true;

        setProfile(profile);

        const preview =
            document.getElementById(
                "background-preview"
            );

        if (preview) {

            preview.src =
                event.target.result;

            preview.style.display =
                "block";
        }

        applySavedAppearance();
    };

    reader.readAsDataURL(file);
}

function saveBackground() {

    const profile = getProfile();

    const color =
        document.getElementById(
            "background-color"
        );

    const enabled =
        document.getElementById(
            "background-image-enabled"
        );

    if (
        color &&
        isValidColor(color.value)
    ) {

        profile.background.color =
            color.value;
    }

    if (enabled) {

        profile.background.enabled =
            enabled.checked;
    }

    setProfile(profile);

    applySavedAppearance();

    alert("背景設定を保存しました！");
}

function loadBackgroundSettings() {

    const profile = getProfile();

    const background =
        profile.background || {};

    const color =
        document.getElementById(
            "background-color"
        );

    const preview =
        document.getElementById(
            "background-preview"
        );

    const enabled =
        document.getElementById(
            "background-image-enabled"
        );

    if (color) {

        color.value =
            background.color ||
            "#fff5fb";
    }

    if (preview) {

        if (background.image) {
    
            preview.src =
                background.image;
    
            preview.style.display =
                "block";
    
        } else {
    
            preview.src = "";
    
            preview.style.display =
                "none";
        }
    }

    if (enabled) {

        enabled.checked =
            background.enabled || false;
    }
}

function applySavedAppearance() {
    const profile = getProfile();
    const background = profile.background || {};

    const appPages = document.querySelectorAll(".app-page");

    const bgColor = background.color || "#fff5fb";

    document.body.style.backgroundColor = bgColor;

    document.body.style.backgroundImage = background.image
        ? `url("${background.image}")`
        : "none";

    
    document.body.style.backgroundPosition = "center top";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";

    appPages.forEach(function(page) {

        page.style.backgroundColor = "transparent";
        page.style.backgroundImage = "none";

    });
}

function resetBackground() {

    const profile = getProfile();

    profile.background = {
        color: "#fff5fb",
        image: "",
        enabled: false
    };

    setProfile(profile);

    const color =
        document.getElementById(
            "background-color"
        );

    const enabled =
        document.getElementById(
            "background-image-enabled"
        );

    const preview =
        document.getElementById(
            "background-preview"
        );

    if (color) {
        color.value = "#fff5fb";
    }

    if (enabled) {
        enabled.checked = false;
    }

    if (preview) {

        preview.src = "";

        preview.style.display =
            "none";
    }

    applySavedAppearance();

    alert("背景を初期状態に戻しました！");
}

function applyProfileColor() {

    const profile = getProfile();

    if (!profile.color) {
        return;
    }

    const color =
        isValidColor(profile.color)
            ? profile.color
            : "#ff99cc";

    document.documentElement.style.setProperty(
        "--oshi-color",
        color
    );
}


// =====================================
// 推し管理
// =====================================

function addOshi() {

    const name =
        prompt("推しの名前を入力してください");

    if (!name || !name.trim()) {
        return;
    }

    const group =
        prompt(
            "グループ名を入力してください",
            ""
        ) || "";

    const color =
        prompt(
            "推しカラーを入力してください\n例：#ff99cc",
            "#ff99cc"
        ) || "#ff99cc";

    const safeColor =
        isValidColor(color)
            ? color
            : "#ff99cc";

    const list = getOshiList();

    list.push({
        id: createId(),
        name: name.trim(),
        group: group.trim(),
        color: safeColor,
        image: ""
    });

    setOshiList(list);

    renderOshiList();
    updateOshiSelects();
    renderHomeOshiList();
}

function editOshi(id) {

    const list = getOshiList();

    const oshi =
        list.find(item => item.id === id);

    if (!oshi) {
        return;
    }

    const name =
        prompt(
            "推しの名前",
            oshi.name
        );

    if (name === null) {
        return;
    }

    const group =
        prompt(
            "グループ名",
            oshi.group || ""
        );

    if (group === null) {
        return;
    }

    const color =
        prompt(
            "推しカラー",
            oshi.color || "#ff99cc"
        );

    if (color === null) {
        return;
    }

    oshi.name =
        name.trim();

    oshi.group =
        group.trim();

    oshi.color =
        isValidColor(color)
            ? color
            : "#ff99cc";

    setOshiList(list);

    renderOshiList();
    updateOshiSelects();
    renderHomeOshiList();
}

function deleteOshi(id) {

    if (!confirm(
        "この推しを削除しますか？"
    )) {
        return;
    }

    const list = getOshiList();

    setOshiList(
        list.filter(
            item => item.id !== id
        )
    );

    renderOshiList();
    updateOshiSelects();
    renderHomeOshiList();
}

function changeOshiImage(id, input) {

    if (
        !input ||
        !input.files ||
        !input.files[0]
    ) {
        return;
    }

    const file = input.files[0];

    if (!file.type.startsWith("image/")) {

        alert("画像ファイルを選択してください。");

        input.value = "";

        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        const list = getOshiList();

        const oshi =
            list.find(
                item => item.id === id
            );

        if (!oshi) {
            return;
        }

        oshi.image =
            event.target.result;

        setOshiList(list);

        renderOshiList();
        renderHomeOshiList();
    };

    reader.readAsDataURL(file);
}

function renderOshiList() {

    const area =
        document.getElementById(
            "oshi-list"
        );

    if (!area) {
        return;
    }

    const list = getOshiList();

    if (list.length === 0) {

        area.innerHTML =
            "<p>まだ推しが登録されていません。</p>";

        return;
    }

    area.innerHTML =
        list.map(function (oshi) {

            const image =
                oshi.image ||
                "../images/default-profile.png";

            return `
                <div class="oshi-card">

                    <img
                        src="${escapeHTML(image)}"
                        alt="推し画像"
                    >

                    <div class="oshi-info">

                        <div class="oshi-name">
                            ${escapeHTML(oshi.name)}
                        </div>

                        <div class="oshi-group">
                            ${escapeHTML(oshi.group || "")}
                        </div>

                        <div class="oshi-actions">

                            <label class="mini-file">
                                📷

                                <input
                                    type="file"
                                    accept="image/*"
                                    onchange="changeOshiImage('${oshi.id}', this)"
                                >
                            </label>

                            <button
                                type="button"
                                onclick="editOshi('${oshi.id}')"
                            >
                                編集
                            </button>

                            <button
                                type="button"
                                onclick="deleteOshi('${oshi.id}')"
                            >
                                削除
                            </button>

                        </div>

                    </div>

                    <div
                        class="oshi-color"
                        style="background-color:${escapeHTML(
                            isValidColor(oshi.color)
                                ? oshi.color
                                : "#ff99cc"
                        )}"
                    ></div>

                </div>
            `;

        }).join("");
}

function updateOshiSelects() {

    const list = getOshiList();

    const ids = [
        "sch-oshi-id",
        "log-oshi-id",
        "goods-oshi-id",
        "money-oshi-id"
    ];

    ids.forEach(function (id) {

        const select =
            document.getElementById(id);

        if (!select) {
            return;
        }

        const currentValue =
            select.value;

        select.innerHTML =
            '<option value="">推しを選択</option>';

        list.forEach(function (oshi) {

            const option =
                document.createElement("option");

            option.value =
                oshi.id;

            option.textContent =
                oshi.name;

            select.appendChild(option);
        });

        if (currentValue) {
            select.value =
                currentValue;
        }
    });
}

function renderHomeOshiList() {

    const area =
        document.getElementById(
            "home-oshi-mini-list"
        );

    if (!area) {
        return;
    }

    const list = getOshiList();

    if (list.length === 0) {

        area.innerHTML =
            "<p>まだ推しが登録されていません。</p>";

        return;
    }

    area.innerHTML =
        list.map(function (oshi) {

            const image =
                oshi.image ||
                "../images/default-profile.png";

            return `
                <div class="oshi-mini">

                    <img
                        src="${escapeHTML(image)}"
                        alt="推し"
                    >

                    <span>
                        ${escapeHTML(oshi.name)}
                    </span>

                </div>
            `;

        }).join("");
}


// =====================================
// スケジュール
// =====================================

function addScheduleManual() {

    const title =
        document.getElementById(
            "sch-title"
        )?.value.trim();

    const date =
        document.getElementById(
            "sch-date"
        )?.value;

    const time =
        document.getElementById(
            "sch-time"
        )?.value;

    const place =
        document.getElementById(
            "sch-place"
        )?.value.trim();

    const memo =
        document.getElementById(
            "sch-memo"
        )?.value.trim();

    const oshiId =
        document.getElementById(
            "sch-oshi-id"
        )?.value;

    if (!title || !date) {

        alert(
            "タイトルと日付を入力してください。"
        );

        return;
    }

    const list =
        getScheduleList();

    list.push({
        id: createId(),
        title: title,
        date: date,
        time: time,
        place: place,
        memo: memo,
        oshiId: oshiId
    });

    list.sort(
        (a, b) =>
            a.date.localeCompare(b.date)
    );

    setScheduleList(list);

    clearScheduleForm();

    renderSchedule();
    renderCalendar();
    updateHomeCountdown();

    alert(
        "スケジュールを登録しました！"
    );
}

function addSchedule() {
    addScheduleManual();
}

function clearScheduleForm() {

    [
        "sch-title",
        "sch-date",
        "sch-time",
        "sch-place",
        "sch-memo"
    ].forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });

    const oshi =
        document.getElementById(
            "sch-oshi-id"
        );

    if (oshi) {
        oshi.value = "";
    }
}

function deleteSchedule(id) {

    if (!confirm(
        "この予定を削除しますか？"
    )) {
        return;
    }

    const list =
        getScheduleList();

    setScheduleList(
        list.filter(
            item => item.id !== id
        )
    );

    renderSchedule();
    renderCalendar();
    updateHomeCountdown();
}

function editSchedule(id) {

    const list =
        getScheduleList();

    const schedule =
        list.find(
            item => item.id === id
        );

    if (!schedule) {
        return;
    }

    const title =
        prompt(
            "イベント名",
            schedule.title
        );

    if (title === null) {
        return;
    }

    const date =
        prompt(
            "日付（YYYY-MM-DD）",
            schedule.date
        );

    if (date === null) {
        return;
    }

    const time =
        prompt(
            "時間",
            schedule.time || ""
        );

    if (time === null) {
        return;
    }

    const place =
        prompt(
            "場所",
            schedule.place || ""
        );

    if (place === null) {
        return;
    }

    const memo =
        prompt(
            "メモ",
            schedule.memo || ""
        );

    if (memo === null) {
        return;
    }

    schedule.title =
        title.trim();

    schedule.date =
        date;

    schedule.time =
        time;

    schedule.place =
        place.trim();

    schedule.memo =
        memo.trim();

    setScheduleList(list);

    renderSchedule();
    renderCalendar();
    updateHomeCountdown();
}

function renderSchedule() {

    const area =
        document.getElementById(
            "schedule-list"
        );

    if (!area) {
        return;
    }

    const list =
        getScheduleList();

    if (list.length === 0) {

        area.innerHTML =
            "<p>予定はまだありません。</p>";

        return;
    }

    const today =
        getToday();

    area.innerHTML =
        list.map(function (item) {

            const past =
                item.date < today;

            return `
                <div class="schedule-card ${past ? "past" : ""}">

                    <div class="schedule-date">
                        ${escapeHTML(item.date)}
                    </div>

                    <div class="schedule-content">

                        <h3>
                            ${escapeHTML(item.title)}
                        </h3>

                        ${
                            item.time
                                ? `<p>⏰ ${escapeHTML(item.time)}</p>`
                                : ""
                        }

                        ${
                            item.place
                                ? `<p>📍 ${escapeHTML(item.place)}</p>`
                                : ""
                        }

                        ${
                            item.memo
                                ? `<p>📝 ${escapeHTML(item.memo)}</p>`
                                : ""
                        }

                    </div>

                    <div class="schedule-actions">

                        <button
                            type="button"
                            onclick="editSchedule('${item.id}')"
                        >
                            編集
                        </button>

                        <button
                            type="button"
                            onclick="deleteSchedule('${item.id}')"
                        >
                            削除
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}

function updateHomeCountdown() {

    const titleElement =
        document.getElementById(
            "next-event-title"
        );

    const daysElement =
        document.getElementById(
            "countdown-days"
        );

    if (!titleElement || !daysElement) {
        return;
    }

    const today =
        getToday();

    const futureEvents =
        getScheduleList()
            .filter(
                item =>
                    item.date >= today
            )
            .sort(
                (a, b) =>
                    a.date.localeCompare(
                        b.date
                    )
            );

    if (futureEvents.length === 0) {

        titleElement.textContent =
            "未定";

        daysElement.textContent =
            "--";

        return;
    }

    const next =
        futureEvents[0];

    titleElement.textContent =
        next.title;

    const target =
        new Date(
            next.date +
            "T00:00:00"
        );

    const now =
        new Date();

    now.setHours(
        0,
        0,
        0,
        0
    );

    const days =
        Math.ceil(
            (
                target.getTime() -
                now.getTime()
            ) /
            (1000 * 60 * 60 * 24)
        );

    daysElement.textContent =
        days === 0
            ? "今日"
            : days;
}

function updateCountdown() {
    updateHomeCountdown();
}


// =====================================
// 思い出ログ
// =====================================

function saveLog() {

    const title =
        document.getElementById(
            "log-title"
        )?.value.trim();

    const date =
        document.getElementById(
            "log-date"
        )?.value ||
        getToday();

    const place =
        document.getElementById(
            "log-place"
        )?.value.trim();

    const feeling =
        document.getElementById(
            "log-feeling"
        )?.value;

    const memo =
        document.getElementById(
            "log-memo"
        )?.value.trim();

    const oshiId =
        document.getElementById(
            "log-oshi-id"
        )?.value;

    const imageInput =
        document.getElementById(
            "log-image"
        );

    if (
        !title &&
        !memo &&
        !imageInput?.files?.[0]
    ) {

        alert(
            "思い出のタイトル、内容、または写真を入力してください。"
        );

        return;
    }

    if (
        imageInput &&
        imageInput.files &&
        imageInput.files[0]
    ) {

        const file =
            imageInput.files[0];

        if (!file.type.startsWith("image/")) {

            alert(
                "画像ファイルを選択してください。"
            );

            return;
        }

        const reader =
            new FileReader();

        reader.onload =
            function (event) {

                saveLogData({

                    title: title,
                    date: date,
                    place: place,
                    feeling: feeling,
                    memo: memo,
                    oshiId: oshiId,
                    image: event.target.result

                });
            };

        reader.readAsDataURL(file);

    } else {

        saveLogData({

            title: title,
            date: date,
            place: place,
            feeling: feeling,
            memo: memo,
            oshiId: oshiId,
            image: ""

        });
    }
}

function addLog() {
    saveLog();
}

function saveLogData(data) {

    const list =
        getLogList();

    list.unshift({

        id: createId(),

        title:
            data.title || "",

        date:
            data.date || getToday(),

        place:
            data.place || "",

        feeling:
            data.feeling || "",

        memo:
            data.memo || "",

        oshiId:
            data.oshiId || "",

        image:
            data.image || ""

    });

    setLogList(list);

    clearLogForm();

    renderLog();
    renderHomeLatestLog();
    renderCalendar();

    alert(
        "ログを保存しました！"
    );
}

function clearLogForm() {

    [
        "log-title",
        "log-date",
        "log-place",
        "log-memo"
    ].forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });

    const image =
        document.getElementById(
            "log-image"
        );

    if (image) {
        image.value = "";
    }
}

function deleteLog(id) {

    if (!confirm(
        "このログを削除しますか？"
    )) {
        return;
    }

    const list =
        getLogList();

    setLogList(
        list.filter(
            item => item.id !== id
        )
    );

    renderLog();
    renderHomeLatestLog();
    renderCalendar();
}

function renderLog() {

    const area =
        document.getElementById(
            "log-list"
        );

    if (!area) {
        return;
    }

    const list =
        getLogList();

    if (list.length === 0) {

        area.innerHTML =
            "<p>まだ思い出ログがありません。</p>";

        return;
    }

    area.innerHTML =
        list.map(function (item) {

            return `
                <article class="log-card">

                    ${
                        item.image
                            ? `
                                <img
                                    src="${escapeHTML(item.image)}"
                                    alt="思い出写真"
                                >
                            `
                            : ""
                    }

                    <div class="log-card-content">

                        <div class="log-date">
                            ${escapeHTML(item.date)}
                        </div>

                        <h3>
                            ${escapeHTML(item.title)}
                        </h3>

                        ${
                            item.place
                                ? `<p>📍 ${escapeHTML(item.place)}</p>`
                                : ""
                        }

                        ${
                            item.feeling
                                ? `<p>${escapeHTML(item.feeling)}</p>`
                                : ""
                        }

                        ${
                            item.memo
                                ? `<p>${escapeHTML(item.memo).replace(/\n/g, "<br>")}</p>`
                                : ""
                        }

                        <button
                            type="button"
                            onclick="deleteLog('${item.id}')"
                        >
                            削除
                        </button>

                    </div>

                </article>
            `;

        }).join("");
}


// =====================================
// グッズ
// =====================================

function saveGoods() {

    const name =
        document.getElementById(
            "goods-name"
        )?.value.trim();

    const category =
        document.getElementById(
            "goods-category"
        )?.value;

    const price =
        Number(
            document.getElementById(
                "goods-price"
            )?.value || 0
        );

    const date =
        document.getElementById(
            "goods-date"
        )?.value ||
        getToday();

    const memo =
        document.getElementById(
            "goods-memo"
        )?.value.trim();

    const oshiId =
        document.getElementById(
            "goods-oshi-id"
        )?.value;

    if (!name) {

        alert(
            "グッズ名を入力してください。"
        );

        return;
    }

    const list =
        getGoodsList();

    list.unshift({

        id: createId(),

        name: name,

        category:
            category || "",

        price: price,

        date: date,

        memo: memo,

        oshiId:
            oshiId || ""

    });

    setGoodsList(list);

    clearGoodsForm();

    renderGoods();
    renderMoneySummary();
    updateHomeMoney();
    renderCalendar();

    alert(
        "グッズを登録しました！"
    );
}

function addGoods() {
    saveGoods();
}

function clearGoodsForm() {

    [
        "goods-name",
        "goods-price",
        "goods-date",
        "goods-memo"
    ].forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });

    const category =
        document.getElementById(
            "goods-category"
        );

    if (category) {
        category.value = "";
    }

    const oshi =
        document.getElementById(
            "goods-oshi-id"
        );

    if (oshi) {
        oshi.value = "";
    }
}

function deleteGoods(id) {

    if (!confirm(
        "このグッズを削除しますか？"
    )) {
        return;
    }

    const list =
        getGoodsList();

    setGoodsList(
        list.filter(
            item => item.id !== id
        )
    );

    renderGoods();
    renderMoneySummary();
    updateHomeMoney();
    renderCalendar();
}

function renderGoods() {

    const area =
        document.getElementById(
            "goods-list"
        );

    if (!area) {
        return;
    }

    const list =
        getGoodsList();

    if (list.length === 0) {

        area.innerHTML =
            "<p>グッズがありません。</p>";

        return;
    }

    area.innerHTML =
        list.map(function (item) {

            return `
                <div class="goods-card">

                    <div>

                        <h3>
                            ${escapeHTML(item.name)}
                        </h3>

                        ${
                            item.category
                                ? `<p>📂 ${escapeHTML(item.category)}</p>`
                                : ""
                        }

                        <p>
                            📅 ${escapeHTML(item.date || "")}
                        </p>

                        ${
                            item.memo
                                ? `<p>📝 ${escapeHTML(item.memo)}</p>`
                                : ""
                        }

                    </div>

                    <strong>
                        ${formatYen(item.price)}
                    </strong>

                    <button
                        type="button"
                        onclick="deleteGoods('${item.id}')"
                    >
                        削除
                    </button>

                </div>
            `;

        }).join("");
}


// =====================================
// お金
// =====================================

function saveMoney() {

    const title =
        document.getElementById(
            "money-title"
        )?.value.trim();

    const amount =
        Number(
            document.getElementById(
                "money-price"
            )?.value || 0
        );

    const date =
        document.getElementById(
            "money-date"
        )?.value ||
        getToday();

    const category =
        document.getElementById(
            "money-category"
        )?.value;

    const memo =
        document.getElementById(
            "money-memo"
        )?.value.trim();

    const oshiId =
        document.getElementById(
            "money-oshi-id"
        )?.value;

    if (!title || amount <= 0) {

        alert(
            "内容と金額を入力してください。"
        );

        return;
    }

    const list =
        getMoneyList();

    list.unshift({

        id: createId(),

        title: title,

        amount: amount,

        date: date,

        category:
            category || "",

        memo: memo,

        oshiId:
            oshiId || "",

        type: "expense"

    });

    setMoneyList(list);

    clearMoneyForm();

    renderMoney();
    renderMoneySummary();
    updateHomeMoney();
    renderCalendar();

    alert(
        "お金の記録を保存しました！"
    );
}

function addMoney() {
    saveMoney();
}

function clearMoneyForm() {

    [
        "money-title",
        "money-price",
        "money-date",
        "money-memo"
    ].forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });

    const category =
        document.getElementById(
            "money-category"
        );

    if (category) {
        category.value = "";
    }

    const oshi =
        document.getElementById(
            "money-oshi-id"
        );

    if (oshi) {
        oshi.value = "";
    }
}

function deleteMoney(id) {

    if (!confirm(
        "この記録を削除しますか？"
    )) {
        return;
    }

    const list =
        getMoneyList();

    setMoneyList(
        list.filter(
            item => item.id !== id
        )
    );

    renderMoney();
    renderMoneySummary();
    updateHomeMoney();
    renderCalendar();
}

function renderMoney() {

    const area =
        document.getElementById(
            "money-list"
        );

    if (!area) {
        return;
    }

    const list =
        getMoneyList();

    if (list.length === 0) {

        area.innerHTML =
            "<p>お金の記録がありません。</p>";

        return;
    }

    area.innerHTML =
        list.map(function (item) {

            return `
                <div class="money-card">

                    <div>

                        <h3>
                            ${escapeHTML(item.title)}
                        </h3>

                        <p>
                            📅 ${escapeHTML(item.date || "")}
                        </p>

                        ${
                            item.category
                                ? `<p>📂 ${escapeHTML(item.category)}</p>`
                                : ""
                        }

                        ${
                            item.memo
                                ? `<p>📝 ${escapeHTML(item.memo)}</p>`
                                : ""
                        }

                    </div>

                    <strong class="expense">
                        -${formatYen(item.amount)}
                    </strong>

                    <button
                        type="button"
                        onclick="deleteMoney('${item.id}')"
                    >
                        削除
                    </button>

                </div>
            `;

        }).join("");
}

function renderMoneySummary() {

    const moneyList = getMoneyList();
    const goodsList = getGoodsList();

    const today = new Date();

    const currentYear =
        today.getFullYear();

    const currentMonth =
        String(today.getMonth() + 1).padStart(2, "0");

    const currentMonthKey =
        `${currentYear}-${currentMonth}`;

    // お金管理で登録した支出
    const moneyTotal =
        moneyList
            .filter(function(item) {

                if (!item.date) {
                    return false;
                }

                return String(item.date)
                    .substring(0, 7) === currentMonthKey;

            })
            .reduce(function(sum, item) {

                return sum +
                    Number(
                        item.amount || 0
                    );

            }, 0);


    // グッズ代も今月の支出として合計
    const goodsTotal =
        goodsList
            .filter(function(item) {

                if (!item.date) {
                    return false;
                }

                return String(item.date)
                    .substring(0, 7) === currentMonthKey;

            })
            .reduce(function(sum, item) {

                return sum +
                    Number(
                        item.price || 0
                    );

            }, 0);


    const total =
        moneyTotal + goodsTotal;


    // 「今月の支出」
    const totalElement =
        document.getElementById(
            "total-money"
        );

    if (totalElement) {

        totalElement.textContent =
            formatYen(total);

    }


    // ほかのページで使っている場合
    const expenseElement =
        document.getElementById(
            "total-expense"
        );

    if (expenseElement) {

        expenseElement.textContent =
            formatYen(total);

    }


    const balanceElement =
        document.getElementById(
            "total-balance"
        );

    if (balanceElement) {

        balanceElement.textContent =
            formatYen(-total);

    }
}

function updateHomeMoney() {

    const element =
        document.getElementById(
            "home-total-money"
        );

    if (!element) {
        return;
    }

    const currentMonth =
        getToday().substring(0, 7);

    const moneyTotal =
        getMoneyList()
            .filter(
                item =>
                    item.date &&
                    item.date.startsWith(
                        currentMonth
                    )
            )
            .reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.amount || 0
                    ),
                0
            );

    const goodsTotal =
        getGoodsList()
            .filter(
                item =>
                    item.date &&
                    item.date.startsWith(
                        currentMonth
                    )
            )
            .reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.price || 0
                    ),
                0
            );

    element.textContent =
        formatYen(
            moneyTotal +
            goodsTotal
        );
}


// =====================================
// ホーム
// =====================================

function renderHomeLatestLog() {

    const area =
        document.getElementById(
            "home-latest-log"
        );

    if (!area) {
        return;
    }

    const list =
        getLogList();

    if (list.length === 0) {

        area.innerHTML =
            "まだありません";

        return;
    }

    const log =
        list[0];

    area.innerHTML = `

        <div class="home-log">

            ${
                log.image
                    ? `
                        <img
                            src="${escapeHTML(log.image)}"
                            alt="最近の思い出"
                        >
                    `
                    : ""
            }

            <div>

                <strong>
                    ${escapeHTML(
                        log.title ||
                        "思い出"
                    )}
                </strong>

                <p>
                    ${escapeHTML(
                        log.date || ""
                    )}
                </p>

            </div>

        </div>

    `;
}


// =====================================
// プロフィール表示
// =====================================

function openProfile() {

    const profile =
        getProfile();

    const name =
        document.getElementById(
            "profile-display-name"
        );

    const message =
        document.getElementById(
            "profile-display-message"
        );

    const image =
        document.getElementById(
            "profile-display-image"
        );

    if (name) {

        name.textContent =
            profile.name ||
            "名前未設定";
    }

    if (message) {

        message.textContent =
            profile.message ||
            "";
    }

    if (
        image &&
        profile.image
    ) {

        image.src =
            profile.image;
    }

    applyProfileColor();
}


// =====================================
// 大きいカレンダー
// =====================================

// 現在表示している年月
let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth();

// 選択中の日付
let selectedCalendarDate = null;


// -------------------------------------
// ページ種類を取得
// -------------------------------------

function getCalendarType() {

    const body =
        document.body;

    if (!body) {
        return "";
    }

    return body.dataset.calendarType || "";
}


// -------------------------------------
// ページごとの設定
// -------------------------------------

function getCalendarConfig() {

    const type =
        getCalendarType();

    const configs = {

        schedule: {
            title: "📅 カレンダー",
            key: STORAGE_KEYS.SCHEDULE,
            eventClass: "ol-event-schedule"
        },

        log: {
            title: "📸 思い出カレンダー",
            key: STORAGE_KEYS.LOG,
            eventClass: "ol-event-log"
        },

        goods: {
            title: "🛍️ グッズカレンダー",
            key: STORAGE_KEYS.GOODS,
            eventClass: "ol-event-goods"
        },

        money: {
            title: "💰 お金カレンダー",
            key: STORAGE_KEYS.MONEY,
            eventClass: "ol-event-money"
        }

    };

    return configs[type] || null;
}


// -------------------------------------
// カレンダー用データ
// -------------------------------------

function getCalendarData() {

    const type =
        getCalendarType();

    switch (type) {

        case "schedule":
            return getScheduleList();

        case "log":
            return getLogList();

        case "goods":
            return getGoodsList();

        case "money":
            return getMoneyList();

        default:
            return [];
    }
}


// -------------------------------------
// データの日付を取得
// -------------------------------------

function getCalendarItemDate(item) {

    if (!item) {
        return "";
    }

    return item.date || "";
}


// -------------------------------------
// カレンダー表示
// -------------------------------------

function renderCalendar() {

    const area =
        document.getElementById(
            "calendar"
        );

    if (!area) {
        return;
    }

    const config =
        getCalendarConfig();

    if (!config) {
        return;
    }

    const year =
        calendarYear;

    const month =
        calendarMonth;

    const firstDay =
        new Date(
            year,
            month,
            1
        );

    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );

    const startWeek =
        firstDay.getDay();

    const daysInMonth =
        lastDay.getDate();

    const today =
        getToday();

    const monthString =
        `${year}-${String(month + 1).padStart(2, "0")}`;

    const data =
        getCalendarData();

    let html = `

        <div class="ol-calendar">

            <div class="ol-calendar-header">

                <div class="ol-calendar-nav">

                    <button
                        type="button"
                        onclick="changeCalendarMonth(-1)"
                        aria-label="前の月"
                    >
                        ‹
                    </button>

                    <button
                        type="button"
                        onclick="changeCalendarMonth(1)"
                        aria-label="次の月"
                    >
                        ›
                    </button>

                </div>

                <div class="ol-calendar-title">
                    ${year}年${month + 1}月
                </div>

                <button
                    type="button"
                    class="ol-today-btn"
                    onclick="goToTodayCalendar()"
                >
                    今日
                </button>

            </div>

            <div class="ol-calendar-weekdays">

                <div class="ol-weekday">日</div>
                <div class="ol-weekday">月</div>
                <div class="ol-weekday">火</div>
                <div class="ol-weekday">水</div>
                <div class="ol-weekday">木</div>
                <div class="ol-weekday">金</div>
                <div class="ol-weekday">土</div>

            </div>

            <div class="ol-calendar-grid">
    `;


    // 前月の空白
    for (
        let i = 0;
        i < startWeek;
        i++
    ) {

        html += `
            <div class="ol-calendar-day empty"></div>
        `;
    }


    // 日付
    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const dateObj =
            new Date(
                year,
                month,
                day
            );

        const weekDay =
            dateObj.getDay();

        const isToday =
            dateString === today;

        const isSelected =
            dateString ===
            selectedCalendarDate;

        const dayItems =
            data.filter(
                item =>
                    getCalendarItemDate(item) ===
                    dateString
            );

        let classes =
            "ol-calendar-day";

        if (isToday) {
            classes += " today";
        }

        if (isSelected) {
            classes += " selected";
        }

        if (weekDay === 0) {
            classes += " sunday";
        }

        if (weekDay === 6) {
            classes += " saturday";
        }

        html += `

            <div
                class="${classes}"
                onclick="selectCalendarDate('${dateString}')"
            >

                <div class="ol-calendar-number">
                    ${day}
                </div>

                <div class="ol-calendar-events">
        `;


        // イベントを最大3件表示
        dayItems
            .slice(0, 3)
            .forEach(function (item) {

                let title = "";

                switch (getCalendarType()) {

                    case "schedule":
                        title =
                            item.title ||
                            "予定";
                        break;

                    case "log":
                        title =
                            item.title ||
                            "思い出";
                        break;

                    case "goods":
                        title =
                            item.name ||
                            "グッズ";
                        break;

                    case "money":
                        title =
                            item.title ||
                            "支出";
                        break;

                    default:
                        title = "記録";
                }

                html += `

                    <div
                        class="ol-calendar-event ${config.eventClass}"
                    >
                        ${escapeHTML(title)}
                    </div>

                `;
            });


        if (dayItems.length > 3) {

            html += `

                <div class="ol-calendar-more">
                    +${dayItems.length - 3}件
                </div>

            `;
        }

        html += `

                </div>

            </div>

        `;
    }


    // 次月の空白
    const totalCells =
        startWeek +
        daysInMonth;

    const remaining =
        (7 - (totalCells % 7)) % 7;

    for (
        let i = 0;
        i < remaining;
        i++
    ) {

        html += `
            <div class="ol-calendar-day empty"></div>
        `;
    }


    html += `

            </div>

        </div>

        <div
            id="calendar-modal"
            class="ol-calendar-modal"
        ></div>

    `;

    area.innerHTML =
        html;
}


// -------------------------------------
// 月変更
// -------------------------------------

function changeCalendarMonth(direction) {

    calendarMonth += direction;

    if (calendarMonth < 0) {

        calendarMonth = 11;
        calendarYear--;

    }

    if (calendarMonth > 11) {

        calendarMonth = 0;
        calendarYear++;

    }

    selectedCalendarDate = null;

    renderCalendar();
}


// -------------------------------------
// 今日
// -------------------------------------

function goToTodayCalendar() {

    const today =
        new Date();

    calendarYear =
        today.getFullYear();

    calendarMonth =
        today.getMonth();

    selectedCalendarDate =
        getToday();

    renderCalendar();

    setTimeout(function () {

        selectCalendarDate(
            selectedCalendarDate
        );

    }, 50);
}


// -------------------------------------
// 日付クリック
// -------------------------------------

function selectCalendarDate(dateString) {

    selectedCalendarDate =
        dateString;

    renderCalendar();

    openCalendarModal(
        dateString
    );
}


// -------------------------------------
// モーダルを開く
// -------------------------------------

function openCalendarModal(dateString) {

    const modal =
        document.getElementById(
            "calendar-modal"
        );

    if (!modal) {
        return;
    }

    const type =
        getCalendarType();

    const items =
        getCalendarData().filter(
            item =>
                getCalendarItemDate(item) ===
                dateString
        );

    let title = "";

    switch (type) {

        case "schedule":
            title = "📅 この日の予定";
            break;

        case "log":
            title = "📸 この日の思い出";
            break;

        case "goods":
            title = "🛍️ この日のグッズ";
            break;

        case "money":
            title = "💰 この日の支出";
            break;

        default:
            title = "この日の記録";
    }


    let recordsHTML = "";


    if (items.length === 0) {

        recordsHTML = `
            <div class="ol-calendar-record">
                <div class="ol-calendar-record-info">
                    この日の記録はまだありません。
                </div>
            </div>
        `;

    } else {

        recordsHTML =
            items.map(function (item) {

                return createCalendarRecordHTML(
                    type,
                    item
                );

            }).join("");
    }


    modal.innerHTML = `

        <div
            class="ol-calendar-modal-box"
            onclick="event.stopPropagation()"
        >

            <div class="ol-calendar-modal-header">

                <div class="ol-calendar-modal-date">
                    ${formatDateJapanese(dateString)}
                </div>

                <button
                    type="button"
                    class="ol-calendar-modal-close"
                    onclick="closeCalendarModal()"
                >
                    ×
                </button>

            </div>

            <h3 style="margin-bottom:12px;color:#ff5da8;">
                ${title}
            </h3>

            <div>
                ${recordsHTML}
            </div>

            <button
                type="button"
                class="ol-calendar-add-btn"
                onclick="showCalendarAddForm('${dateString}')"
            >
                ＋ この日に追加する
            </button>

            <div id="calendar-add-form"></div>

        </div>

    `;

    modal.classList.add("show");

    modal.onclick =
        function (event) {

            if (
                event.target === modal
            ) {
                closeCalendarModal();
            }

        };
}


// -------------------------------------
// 記録表示
// -------------------------------------

function createCalendarRecordHTML(
    type,
    item
) {

    let title = "";
    let info = "";

    if (type === "schedule") {

        title =
            item.title || "予定";

        info = `
            ${item.time
                ? `⏰ ${escapeHTML(item.time)}<br>`
                : ""
            }

            ${item.place
                ? `📍 ${escapeHTML(item.place)}<br>`
                : ""
            }

            ${item.memo
                ? `📝 ${escapeHTML(item.memo)}`
                : ""
            }
        `;

    } else if (type === "log") {

        title =
            item.title || "思い出";

        info = `
            ${item.place
                ? `📍 ${escapeHTML(item.place)}<br>`
                : ""
            }

            ${item.feeling
                ? `${escapeHTML(item.feeling)}<br>`
                : ""
            }

            ${item.memo
                ? `📝 ${escapeHTML(item.memo)}`
                : ""
            }

            ${
                item.image
                    ? `
                        <img
                            src="${escapeHTML(item.image)}"
                            alt="思い出"
                            style="
                                width:100%;
                                max-height:180px;
                                object-fit:cover;
                                border-radius:12px;
                                margin-top:10px;
                            "
                        >
                    `
                    : ""
            }
        `;

    } else if (type === "goods") {

        title =
            item.name || "グッズ";

        info = `
            ${item.category
                ? `📂 ${escapeHTML(item.category)}<br>`
                : ""
            }

            💰 ${formatYen(item.price)}

            ${item.memo
                ? `<br>📝 ${escapeHTML(item.memo)}`
                : ""
            }
        `;

    } else if (type === "money") {

        title =
            item.title || "支出";

        info = `
            💰 ${formatYen(item.amount)}

            ${item.category
                ? `<br>📂 ${escapeHTML(item.category)}`
                : ""
            }

            ${item.memo
                ? `<br>📝 ${escapeHTML(item.memo)}`
                : ""
            }
        `;
    }


    let deleteFunction = "";

    if (type === "schedule") {

        deleteFunction =
            `deleteScheduleFromCalendar('${item.id}')`;

    } else if (type === "log") {

        deleteFunction =
            `deleteLogFromCalendar('${item.id}')`;

    } else if (type === "goods") {

        deleteFunction =
            `deleteGoodsFromCalendar('${item.id}')`;

    } else if (type === "money") {

        deleteFunction =
            `deleteMoneyFromCalendar('${item.id}')`;
    }


    return `

        <div class="ol-calendar-record">

            <div class="ol-calendar-record-title">
                ${escapeHTML(title)}
            </div>

            <div class="ol-calendar-record-info">
                ${info}
            </div>

            <button
                type="button"
                class="delete-btn"
                onclick="${deleteFunction}"
            >
                削除
            </button>

        </div>

    `;
}


// -------------------------------------
// 追加フォーム
// -------------------------------------

function showCalendarAddForm(dateString) {

    const area =
        document.getElementById(
            "calendar-add-form"
        );

    if (!area) {
        return;
    }

    const type =
        getCalendarType();

    let html = "";


    // スケジュール
    if (type === "schedule") {

        html = `

            <div class="ol-calendar-form">

                <h3>📅 予定を追加</h3>

                <label>
                    推し
                </label>

                <select id="calendar-sch-oshi">
                    <option value="">推しを選択</option>
                </select>

                <label>
                    イベント名
                </label>

                <input
                    id="calendar-sch-title"
                    type="text"
                    placeholder="ライブ・イベントなど"
                >

                <label>
                    時間
                </label>

                <input
                    id="calendar-sch-time"
                    type="text"
                    placeholder="18:00〜"
                >

                <label>
                    場所
                </label>

                <input
                    id="calendar-sch-place"
                    type="text"
                    placeholder="会場名など"
                >

                <label>
                    メモ
                </label>

                <textarea
                    id="calendar-sch-memo"
                    rows="3"
                    placeholder="メモ"
                ></textarea>

                <button
                    type="button"
                    onclick="saveCalendarSchedule('${dateString}')"
                >
                    保存する
                </button>

                <button
                    type="button"
                    class="ol-calendar-cancel-btn"
                    onclick="hideCalendarAddForm()"
                >
                    キャンセル
                </button>

            </div>

        `;

    }


    // ログ
    else if (type === "log") {

        html = `

            <div class="ol-calendar-form">

                <h3>📸 思い出を追加</h3>

                <label>
                    推し
                </label>

                <select id="calendar-log-oshi">
                    <option value="">推しを選択</option>
                </select>

                <label>
                    タイトル
                </label>

                <input
                    id="calendar-log-title"
                    type="text"
                    placeholder="今日の思い出"
                >

                <label>
                    場所
                </label>

                <input
                    id="calendar-log-place"
                    type="text"
                    placeholder="場所"
                >

                <label>
                    気持ち
                </label>

                <input
                    id="calendar-log-feeling"
                    type="text"
                    placeholder="楽しかった！"
                >

                <label>
                    メモ
                </label>

                <textarea
                    id="calendar-log-memo"
                    rows="3"
                    placeholder="思い出を残そう"
                ></textarea>

                <button
                    type="button"
                    onclick="saveCalendarLog('${dateString}')"
                >
                    保存する
                </button>

                <button
                    type="button"
                    class="ol-calendar-cancel-btn"
                    onclick="hideCalendarAddForm()"
                >
                    キャンセル
                </button>

            </div>

        `;
    }


    // グッズ
    else if (type === "goods") {

        html = `

            <div class="ol-calendar-form">

                <h3>🛍️ グッズを追加</h3>

                <label>
                    推し
                </label>

                <select id="calendar-goods-oshi">
                    <option value="">推しを選択</option>
                </select>

                <label>
                    グッズ名
                </label>

                <input
                    id="calendar-goods-name"
                    type="text"
                    placeholder="アクスタなど"
                >

                <label>
                    カテゴリ
                </label>

                <input
                    id="calendar-goods-category"
                    type="text"
                    placeholder="アクスタ・缶バッジなど"
                >

                <label>
                    金額
                </label>

                <input
                    id="calendar-goods-price"
                    type="number"
                    min="0"
                    placeholder="1000"
                >

                <label>
                    メモ
                </label>

                <textarea
                    id="calendar-goods-memo"
                    rows="3"
                    placeholder="購入場所など"
                ></textarea>

                <button
                    type="button"
                    onclick="saveCalendarGoods('${dateString}')"
                >
                    保存する
                </button>

                <button
                    type="button"
                    class="ol-calendar-cancel-btn"
                    onclick="hideCalendarAddForm()"
                >
                    キャンセル
                </button>

            </div>

        `;
    }


    // お金
    else if (type === "money") {

        html = `

            <div class="ol-calendar-form">

                <h3>💰 お金を追加</h3>

                <label>
                    推し
                </label>

                <select id="calendar-money-oshi">
                    <option value="">推しを選択</option>
                </select>

                <label>
                    内容
                </label>

                <input
                    id="calendar-money-title"
                    type="text"
                    placeholder="ライブチケットなど"
                >

                <label>
                    金額
                </label>

                <input
                    id="calendar-money-price"
                    type="number"
                    min="0"
                    placeholder="3000"
                >

                <label>
                    カテゴリ
                </label>

                <input
                    id="calendar-money-category"
                    type="text"
                    placeholder="チケットなど"
                >

                <label>
                    メモ
                </label>

                <textarea
                    id="calendar-money-memo"
                    rows="3"
                    placeholder="メモ"
                ></textarea>

                <button
                    type="button"
                    onclick="saveCalendarMoney('${dateString}')"
                >
                    保存する
                </button>

                <button
                    type="button"
                    class="ol-calendar-cancel-btn"
                    onclick="hideCalendarAddForm()"
                >
                    キャンセル
                </button>

            </div>

        `;
    }


    area.innerHTML =
        html;


    // 推し選択肢を入れる
    updateCalendarOshiSelects();
}


// -------------------------------------
// 推し選択肢
// -------------------------------------

function updateCalendarOshiSelects() {

    const list =
        getOshiList();

    const ids = [
        "calendar-sch-oshi",
        "calendar-log-oshi",
        "calendar-goods-oshi",
        "calendar-money-oshi"
    ];

    ids.forEach(function (id) {

        const select =
            document.getElementById(id);

        if (!select) {
            return;
        }

        select.innerHTML =
            '<option value="">推しを選択</option>';

        list.forEach(function (oshi) {

            const option =
                document.createElement("option");

            option.value =
                oshi.id;

            option.textContent =
                oshi.name;

            select.appendChild(option);
        });
    });
}


// -------------------------------------
// 追加フォームを閉じる
// -------------------------------------

function hideCalendarAddForm() {

    const area =
        document.getElementById(
            "calendar-add-form"
        );

    if (area) {
        area.innerHTML = "";
    }
}


// -------------------------------------
// モーダルを閉じる
// -------------------------------------

function closeCalendarModal() {

    const modal =
        document.getElementById(
            "calendar-modal"
        );

    if (modal) {

        modal.classList.remove(
            "show"
        );

        modal.innerHTML = "";
    }
}


// =====================================
// カレンダーからスケジュール追加
// =====================================

function saveCalendarSchedule(date) {

    const title =
        document.getElementById(
            "calendar-sch-title"
        )?.value.trim();

    const time =
        document.getElementById(
            "calendar-sch-time"
        )?.value.trim();

    const place =
        document.getElementById(
            "calendar-sch-place"
        )?.value.trim();

    const memo =
        document.getElementById(
            "calendar-sch-memo"
        )?.value.trim();

    const oshiId =
        document.getElementById(
            "calendar-sch-oshi"
        )?.value;

    if (!title) {

        alert(
            "イベント名を入力してください。"
        );

        return;
    }

    const list =
        getScheduleList();

    list.push({

        id: createId(),

        title: title,

        date: date,

        time: time,

        place: place,

        memo: memo,

        oshiId: oshiId || ""

    });

    list.sort(
        (a, b) =>
            a.date.localeCompare(b.date)
    );

    setScheduleList(list);

    renderSchedule();
    renderCalendar();
    updateHomeCountdown();

    openCalendarModal(date);

    alert(
        "予定を追加しました！"
    );
}


// =====================================
// カレンダーからログ追加
// =====================================

function saveCalendarLog(date) {

    const title =
        document.getElementById(
            "calendar-log-title"
        )?.value.trim();

    const place =
        document.getElementById(
            "calendar-log-place"
        )?.value.trim();

    const feeling =
        document.getElementById(
            "calendar-log-feeling"
        )?.value.trim();

    const memo =
        document.getElementById(
            "calendar-log-memo"
        )?.value.trim();

    const oshiId =
        document.getElementById(
            "calendar-log-oshi"
        )?.value;

    if (
        !title &&
        !memo
    ) {

        alert(
            "タイトルまたはメモを入力してください。"
        );

        return;
    }

    const list =
        getLogList();

    list.unshift({

        id: createId(),

        title:
            title || "",

        date: date,

        place:
            place || "",

        feeling:
            feeling || "",

        memo:
            memo || "",

        oshiId:
            oshiId || "",

        image: ""

    });

    setLogList(list);

    renderLog();
    renderHomeLatestLog();
    renderCalendar();

    openCalendarModal(date);

    alert(
        "思い出を追加しました！"
    );
}


// =====================================
// カレンダーからグッズ追加
// =====================================

function saveCalendarGoods(date) {

    const name =
        document.getElementById(
            "calendar-goods-name"
        )?.value.trim();

    const category =
        document.getElementById(
            "calendar-goods-category"
        )?.value.trim();

    const price =
        Number(
            document.getElementById(
                "calendar-goods-price"
            )?.value || 0
        );

    const memo =
        document.getElementById(
            "calendar-goods-memo"
        )?.value.trim();

    const oshiId =
        document.getElementById(
            "calendar-goods-oshi"
        )?.value;

    if (!name) {

        alert(
            "グッズ名を入力してください。"
        );

        return;
    }

    const list =
        getGoodsList();

    list.unshift({

        id: createId(),

        name: name,

        category:
            category || "",

        price: price,

        date: date,

        memo:
            memo || "",

        oshiId:
            oshiId || ""

    });

    setGoodsList(list);

    renderGoods();
    renderMoneySummary();
    updateHomeMoney();
    renderCalendar();

    openCalendarModal(date);

    alert(
        "グッズを追加しました！"
    );
}


// =====================================
// カレンダーからお金追加
// =====================================

function saveCalendarMoney(date) {

    const title =
        document.getElementById(
            "calendar-money-title"
        )?.value.trim();

    const amount =
        Number(
            document.getElementById(
                "calendar-money-price"
            )?.value || 0
        );

    const category =
        document.getElementById(
            "calendar-money-category"
        )?.value.trim();

    const memo =
        document.getElementById(
            "calendar-money-memo"
        )?.value.trim();

    const oshiId =
        document.getElementById(
            "calendar-money-oshi"
        )?.value;

    if (
        !title ||
        amount <= 0
    ) {

        alert(
            "内容と金額を入力してください。"
        );

        return;
    }

    const list =
        getMoneyList();

    list.unshift({

        id: createId(),

        title: title,

        amount: amount,

        date: date,

        category:
            category || "",

        memo:
            memo || "",

        oshiId:
            oshiId || "",

        type: "expense"

    });

    setMoneyList(list);

    renderMoney();
    renderMoneySummary();
    updateHomeMoney();
    renderCalendar();

    openCalendarModal(date);

    alert(
        "お金の記録を追加しました！"
    );
}


// =====================================
// カレンダーから削除
// =====================================

function deleteScheduleFromCalendar(id) {

    if (!confirm(
        "この予定を削除しますか？"
    )) {
        return;
    }

    const list =
        getScheduleList();

    setScheduleList(
        list.filter(
            item => item.id !== id
        )
    );

    renderSchedule();
    renderCalendar();
    updateHomeCountdown();

    if (selectedCalendarDate) {
        openCalendarModal(
            selectedCalendarDate
        );
    }
}

function deleteLogFromCalendar(id) {

    if (!confirm(
        "この思い出を削除しますか？"
    )) {
        return;
    }

    const list =
        getLogList();

    setLogList(
        list.filter(
            item => item.id !== id
        )
    );

    renderLog();
    renderHomeLatestLog();
    renderCalendar();

    if (selectedCalendarDate) {
        openCalendarModal(
            selectedCalendarDate
        );
    }
}

function deleteGoodsFromCalendar(id) {

    if (!confirm(
        "このグッズを削除しますか？"
    )) {
        return;
    }

    const list =
        getGoodsList();

    setGoodsList(
        list.filter(
            item => item.id !== id
        )
    );

    renderGoods();
    renderMoneySummary();
    updateHomeMoney();
    renderCalendar();

    if (selectedCalendarDate) {
        openCalendarModal(
            selectedCalendarDate
        );
    }
}

function deleteMoneyFromCalendar(id) {

    if (!confirm(
        "この記録を削除しますか？"
    )) {
        return;
    }

    const list =
        getMoneyList();

    setMoneyList(
        list.filter(
            item => item.id !== id
        )
    );

    renderMoney();
    renderMoneySummary();
    updateHomeMoney();
    renderCalendar();

    if (selectedCalendarDate) {
        openCalendarModal(
            selectedCalendarDate
        );
    }
}


// =====================================
// 画像・ボタン設定
// =====================================

function setupImagePreview() {

    const profileInput =
        document.getElementById(
            "profile-image"
        );

    if (profileInput) {

        profileInput.addEventListener(
            "change",
            function () {
                saveProfileImageFile(this);
            }
        );
    }

    const backgroundInput =
        document.getElementById(
            "background-image"
        );

    if (backgroundInput) {

        backgroundInput.addEventListener(
            "change",
            function () {
                saveBackgroundImageFile(this);
            }
        );
    }
}

function setupProfileSaveButton() {

    const button =
        document.getElementById(
            "save-profile"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            saveProfile();
        }
    );
}

function setupBackgroundSaveButton() {

    const button =
        document.getElementById(
            "save-background"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            saveBackground();
        }
    );
}

function setupBackgroundResetButton() {

    const button =
        document.getElementById(
            "reset-background"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            resetBackground();
        }
    );
}

function setupOshiButton() {

    const button =
        document.getElementById(
            "add-oshi"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            addOshi();
        }
    );
}


// =====================================
// カテゴリー管理
// =====================================

const DEFAULT_CATEGORIES = {
    goods: [
        "アクスタ",
        "缶バッジ",
        "ぬいぐるみ",
        "CD",
        "DVD",
        "その他"
    ],

    money: [
        "チケット",
        "グッズ",
        "交通費",
        "宿泊費",
        "食費",
        "その他"
    ]
};


// カテゴリー取得
function getCategoryData() {

    const data = loadData(
        STORAGE_KEYS.CATEGORIES,
        null
    );

    if (!data) {

        const initial =
            JSON.parse(
                JSON.stringify(
                    DEFAULT_CATEGORIES
                )
            );

        saveData(
            STORAGE_KEYS.CATEGORIES,
            initial
        );

        return initial;
    }

    return data;
}


// 指定カテゴリー取得
function getCategories(type) {

    const data = getCategoryData();

    if (!Array.isArray(data[type])) {
        data[type] = [];
    }

    return data[type];
}


// カテゴリー追加
function addCategory(type, selectId) {

    const name = prompt(
        "追加するカテゴリー名を入力してください。"
    );

    if (name === null) {
        return;
    }

    const category = name.trim();

    if (!category) {
        alert("カテゴリー名を入力してください。");
        return;
    }

    const categories = getCategories(type);

    if (categories.includes(category)) {
        alert("そのカテゴリーはすでにあります。");
        return;
    }

    categories.push(category);

    const data = getCategoryData();

    data[type] = categories;

    saveData(
        STORAGE_KEYS.CATEGORIES,
        data
    );

    renderCategorySelects();

    const select =
        document.getElementById(selectId);

    if (select) {
        select.value = category;
    }

    alert(
        `「${category}」を追加しました！`
    );
}


// カテゴリー選択肢を作る
function createCategoryOptions(
    type,
    currentValue = ""
) {

    const categories =
        getCategories(type);

    let html =
        '<option value="">カテゴリーを選択</option>';

    categories.forEach(function(category) {

        html += `
            <option
                value="${escapeHTML(category)}"
                ${category === currentValue ? "selected" : ""}
            >
                ${escapeHTML(category)}
            </option>
        `;
    });

    html += `
        <option value="__add_category__">
            ＋カテゴリーを追加
        </option>
    `;

    return html;
}


// カテゴリーselectを設定
function setupCategorySelect(
    select,
    type
) {

    if (!select) {
        return;
    }

    const currentValue =
        select.value || "";

    select.innerHTML =
        createCategoryOptions(
            type,
            currentValue
        );

    select.value =
        currentValue;

    if (
        select.dataset.categoryReady ===
        "true"
    ) {
        return;
    }

    select.dataset.categoryReady =
        "true";

    select.addEventListener(
        "change",
        function() {

            if (
                this.value ===
                "__add_category__"
            ) {

                const previous =
                    this.dataset.previousValue ||
                    "";

                addCategory(
                    type,
                    this.id
                );

                this.dataset.previousValue =
                    this.value ||
                    previous;

                return;
            }

            this.dataset.previousValue =
                this.value;
        }
    );
}


// カテゴリーselectを全部更新
function renderCategorySelects() {

    const goods =
        document.getElementById(
            "goods-category"
        );

    if (goods) {
        setupCategorySelect(
            goods,
            "goods"
        );
    }


    const money =
        document.getElementById(
            "money-category"
        );

    if (money) {
        setupCategorySelect(
            money,
            "money"
        );
    }


    const calendarGoods =
        document.getElementById(
            "calendar-goods-category"
        );

    if (calendarGoods) {
        setupCategorySelect(
            calendarGoods,
            "goods"
        );
    }


    const calendarMoney =
        document.getElementById(
            "calendar-money-category"
        );

    if (calendarMoney) {
        setupCategorySelect(
            calendarMoney,
            "money"
        );
    }
}

// =====================================
// 初期化
// =====================================

function initializePage() {

    if (!checkLogin()) {
        return;
    }

    loadProfileSettings();

    updateProfileIcons();

    applyProfileColor();

    applySavedAppearance();

    renderOshiList();

    renderHomeOshiList();

    updateOshiSelects();

    renderSchedule();

    renderCalendar();

    updateHomeCountdown();

    renderLog();

    renderHomeLatestLog();

    renderGoods();

    renderMoney();

    renderMoneySummary();

    updateHomeMoney();
}

function updateHomeTodaySchedule() {

    const element =
        document.getElementById(
            "today-schedule-title"
        );

    if (!element) {
        return;
    }

    const today =
        getToday();

    const schedules =
        getScheduleList()
            .filter(
                item =>
                    item.date === today
            )
            .sort(
                (a, b) =>
                    (a.time || "")
                        .localeCompare(
                            b.time || ""
                        )
            );

    if (schedules.length === 0) {

        element.textContent =
            "予定はありません";

        return;
    }

    element.innerHTML =
        schedules
            .map(function (item) {

                return `
                    <div class="home-today-schedule">
                        <strong>
                            ${escapeHTML(
                                item.title || "予定"
                            )}
                        </strong>

                        ${
                            item.time
                                ? `<span>${escapeHTML(item.time)}</span>`
                                : ""
                        }

                        ${
                            item.place
                                ? `<small>${escapeHTML(item.place)}</small>`
                                : ""
                        }
                    </div>
                `;

            })
            .join("");
}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // -----------------------------
        // カレンダーを最優先で表示
        // -----------------------------
        try {
            renderCalendar();
        } catch (error) {
            console.error(
                "カレンダー表示エラー:",
                error
            );
        }


        // -----------------------------
        // その他の初期設定
        // -----------------------------
        try {
            setupImagePreview();
        } catch (error) {
            console.error(
                "画像設定エラー:",
                error
            );
        }

        try {
            setupProfileSaveButton();
        } catch (error) {
            console.error(
                "プロフィール設定エラー:",
                error
            );
        }

        try {
            setupBackgroundSaveButton();
        } catch (error) {
            console.error(
                "背景保存設定エラー:",
                error
            );
        }

        try {
            setupBackgroundResetButton();
        } catch (error) {
            console.error(
                "背景リセット設定エラー:",
                error
            );
        }

        try {
            setupOshiButton();
        } catch (error) {
            console.error(
                "推しボタン設定エラー:",
                error
            );
        }


        // -----------------------------
        // カテゴリー初期設定
        // -----------------------------
        try {
            renderCategorySelects();
        } catch (error) {
            console.error(
                "カテゴリー設定エラー:",
                error
            );
        }


        // -----------------------------
        // 通常ページ初期化
        // -----------------------------
        try {
            initializePage();
            updateHomeTodaySchedule();
        } catch (error) {
            console.error(
                "ページ初期化エラー:",
                error
            );
        }

    }
);

// ============================================================
// お金集計
// ============================================================

function getMoneyDateParts(date) {

    if (!date) {
        return null;
    }

    const parts = String(date).split("-");

    if (parts.length < 2) {
        return null;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);

    if (
        !Number.isFinite(year) ||
        !Number.isFinite(month)
    ) {
        return null;
    }

    return {
        year: year,
        month: month
    };
}


// ============================================================
// 選択できる年度を作る
// ============================================================

function setupMoneyYearSelects() {

    const moneyList = getMoneyList();

    const currentYear =
        new Date().getFullYear();

    const years = new Set();

    // 支出データに存在する年度を追加
    moneyList.forEach(function (money) {

        const parts =
            getMoneyDateParts(money.date);

        if (parts) {
            years.add(parts.year);
        }

    });


    // 現在・来年・再来年を追加
    years.add(currentYear);
    years.add(currentYear + 1);
    years.add(currentYear + 2);


    // 新しい年度順
    const yearList =
        Array.from(years).sort(function (a, b) {

            return b - a;

        });


    const selects = [

        document.getElementById(
            "monthly-money-year"
        ),

        document.getElementById(
            "year-money-select"
        )

    ];


    selects.forEach(function (select) {

        if (!select) {
            return;
        }


        const currentValue =
            select.value;


        select.innerHTML = "";


        yearList.forEach(function (year) {

            const option =
                document.createElement("option");

            option.value =
                String(year);

            option.textContent =
                year + "年";

            select.appendChild(option);

        });


        // 今まで選択していた年度を維持
        if (
            currentValue &&
            yearList.includes(
                Number(currentValue)
            )
        ) {

            select.value =
                currentValue;

        } else {

            // 初期状態は今年
            select.value =
                String(currentYear);

        }

    });

}
// ============================================================
// 年間カテゴリー別
// ============================================================

function renderYearMoneyCategories(
    moneyList,
    selectedYear
) {

    const container =
        document.getElementById(
            "year-money-category"
        );


    if (!container) {
        return;
    }


    const categories = {};


    moneyList.forEach(function (money) {

        const parts =
            getMoneyDateParts(money.date);

        if (!parts) {
            return;
        }


        if (
            parts.year !== selectedYear
        ) {
            return;
        }


        const category =
            money.category ||
            "その他";


        if (
            !categories[category]
        ) {

            categories[category] = 0;

        }


        categories[category] +=
            Number(
                money.amount || 0
            );

    });


    const categoryNames =
        Object.keys(categories);


    if (
        categoryNames.length === 0
    ) {

        container.innerHTML = `

            <p class="money-empty">
                ${selectedYear}年の支出はまだありません
            </p>

        `;

        return;

    }


    // 金額が多い順
    categoryNames.sort(
        function (a, b) {

            return (
                categories[b] -
                categories[a]
            );

        }
    );


    let html = `

        <div class="year-category-title">
            📂 カテゴリー別
        </div>

    `;


    categoryNames.forEach(
        function (category) {

            html += `

                <div class="year-category-item">

                    <span>
                        ${escapeHTML(category)}
                    </span>

                    <strong>
                        ${formatYen(
                            categories[category]
                        )}
                    </strong>

                </div>

            `;

        }
    );


    container.innerHTML =
        html;

}


// ============================================================
// 全体更新
// ============================================================

function updateMoneySummary() {

    setupMoneyYearSelects();

    updateCurrentMonthMoney();

    updateMonthlyMoney();

    updateYearMoney();

}


// ============================================================
// 支出集計タブ切り替え
// ============================================================

function showMoneySummary(
    type,
    button
) {

    const contents = [

        "money-summary-month",

        "money-summary-monthly",

        "money-summary-year"

    ];


    contents.forEach(
        function (id) {

            const element =
                document.getElementById(id);

            if (element) {

                element.style.display =
                    "none";

            }

        }
    );


    const target =
        document.getElementById(
            "money-summary-" + type
        );


    if (target) {

        target.style.display =
            "block";

    }


    document
        .querySelectorAll(
            ".money-summary-tab"
        )
        .forEach(
            function (tab) {

                tab.classList.remove(
                    "active"
                );

            }
        );


    if (button) {

        button.classList.add(
            "active"
        );

    }


    // 切り替えた時にも最新データを反映
    updateMoneySummary();

}

// ============================================================
// 月ごとの支出合計を計算
// ============================================================

function getMonthlyExpenseTotal(year, month) {

    const moneyList = getMoneyList();
    const goodsList = getGoodsList();

    // お金の記録から支出だけを集計
    const moneyTotal = moneyList
        .filter(function (item) {

            const parts = getMoneyDateParts(item.date);

            return parts &&
                parts.year === year &&
                parts.month === month &&
                item.type !== "income";

        })
        .reduce(function (sum, item) {

            return sum + Number(item.amount || 0);

        }, 0);


    // グッズ購入金額を集計
    const goodsTotal = goodsList
        .filter(function (item) {

            const parts = getMoneyDateParts(item.date);

            return parts &&
                parts.year === year &&
                parts.month === month;

        })
        .reduce(function (sum, item) {

            return sum + Number(item.price || 0);

        }, 0);


    return moneyTotal + goodsTotal;

}


// ============================================================
// 今月の支出
// ============================================================

function updateCurrentMonthMoney() {

    const now = new Date();

    const total = getMonthlyExpenseTotal(
        now.getFullYear(),
        now.getMonth() + 1
    );

    const element = document.getElementById("total-money");

    if (element) {
        element.textContent = formatYen(total);
    }

}


// ============================================================
// 月別支出
// ============================================================

function updateMonthlyMoney() {

    const yearSelect = document.getElementById(
        "monthly-money-year"
    );

    const container = document.getElementById(
        "monthly-money-list"
    );

    if (!yearSelect || !container) {
        return;
    }

    const year = Number(yearSelect.value);

    let html = "";

    for (let month = 1; month <= 12; month++) {

        const total = getMonthlyExpenseTotal(year, month);

        html += `
            <div class="monthly-money-item">
                <span>${month}月</span>
                <strong>${formatYen(total)}</strong>
            </div>
        `;

    }

    container.innerHTML = html;

}


// ============================================================
// 年間支出
// ============================================================

function updateYearMoney() {

    const yearSelect = document.getElementById(
        "year-money-select"
    );

    const totalElement = document.getElementById(
        "year-money-total"
    );

    if (!yearSelect) {
        return;
    }

    const year = Number(yearSelect.value);

    let total = 0;

    for (let month = 1; month <= 12; month++) {

        total += getMonthlyExpenseTotal(year, month);

    }

    if (totalElement) {
        totalElement.textContent = formatYen(total);
    }

    renderYearMoneyCategories(
        getMoneyList(),
        year
    );

}