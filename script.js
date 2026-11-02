const K = "ballot-v2", $ = i => document.getElementById(i), esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
        const NM = "Aarav Diya Kabir Meera Rohan Isha Vivaan Anaya Arjun Sara Dev Kiara Neil Tara Yash Riya Ishaan Myra Karan Zoya Aditya Naina Veer Pooja Rahul Sneha Om Tanvi Samar Aisha Harsh Pari Krish Nisha Manav Leela Rudra Esha Jay Kavya".split(" ");
        const now = () => new Date().toLocaleString();
        const seed = () => ({
            voters: [...["Arushri Nagrale", "Snehal Gondchavar", "Shravani Sange"], ...NM.slice(0, 37).map((n, i) => n + " " + ["Shah", "Rao", "Iyer", "Khan", "Patil"][i % 5])].map((n, i) => ({ id: "V" + (1001 + i), name: n, pw: "vote123", voted: false })),
            positions: [{ id: "p1", title: "President", cands: [{ id: "c1", name: "Aarav Mehta", bio: "Better labs and a 24/7 library." }, { id: "c2", name: "Diya Nair", bio: "Open budgets, student-run events." }, { id: "c3", name: "Kabir Sethi", bio: "Placement support for every branch." }] },
            { id: "p2", title: "Secretary", cands: [{ id: "c4", name: "Meera Joshi", bio: "One app for every notice." }, { id: "c5", name: "Rohan Das", bio: "Faster club approvals." }] },
            { id: "p3", title: "Treasurer", cands: [{ id: "c6", name: "Isha Verma", bio: "Public monthly spending reports." }, { id: "c7", name: "Vivaan Roy", bio: "Sponsorships for more fests." }] }], votes: [], status: "upcoming", log: [{ t: now(), m: "Election created" }]
        });
        let S = null; try { S = JSON.parse(localStorage.getItem(K)) } catch (e) { } if (!S) S = seed();
        const save = () => { try { localStorage.setItem(K, JSON.stringify(S)) } catch (e) { } };
        const toast = m => { const t = $("toast"); t.textContent = m; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 2400) };
        let U = null, pend = null, rcpt = null;
        const nm = (p, c) => c == "nota" ? "None of the above" : S.positions.find(x => x.id == p).cands.find(x => x.id == c).name;
        const log = m => S.log.unshift({ t: now(), m });
        function res() {
            return S.positions.map(p => {
                const vs = S.votes.filter(v => v.pos == p.id), tot = vs.length || 1;
                const rows = [...p.cands, { id: "nota", name: "None of the above" }].map(c => ({ c, n: vs.filter(v => v.cand == c.id).length })), top = Math.max(...rows.map(r => r.n));
                return `<div style="margin-bottom:16px"><b>${esc(p.title)}</b>` + rows.map(r => `<div class="m" style="justify-content:space-between;margin-top:8px"><span>${esc(r.c.name)} ${r.n == top && top > 0 && r.c.id != "nota" ? '<span class="pill risk">Winner</span>' : ""}</span><span>${r.n} votes</span></div><div class="bar"><i style="width:${r.n / tot * 100}%;background:linear-gradient(90deg,var(--c1),var(--c3))"></i></div>`).join("") + `</div>`
            }).join("")
        }
        const loginV = () => `<div class="sec" style="max-width:440px;margin:30px auto"><h2>Log in to vote</h2><input class="fi" id="lid" placeholder="Voter ID" autocomplete="off"><input class="fi" id="lpw" type="password" placeholder="Password"><button class="p" data-a="login" style="width:100%">Log in</button>
<div class="hint">Demo voters (password <b>vote123</b>):<br><b>V1001</b> Arushri Nagrale · <b>V1002</b> Snehal Gondchavar · <b>V1003</b> Shravani Sange<br>Other IDs up to V1040 are fake voters.<br>Demo admin: <b>anushka</b> / <b>admin123</b> (Anushka Pakhale)</div></div>`;
        function voterV() {
            const v = S.voters.find(x => x.id == U.id); let b;
            if (S.status == "closed") b = `<div class="sec"><h2>Final results</h2>${res()}</div>`;
            else if (v.voted) b = `<div class="sec"><h2>Vote locked ✓</h2><div class="m">Thanks, ${esc(v.name)}. Your ballot is sealed and cannot be changed. Results appear when the polls close.</div>${rcpt ? `<div class="rc grad">${rcpt}</div><div class="m">Your receipt code. Keep it safe; it is shown only once.</div>` : ""}</div>`;
            else if (S.status == "upcoming") b = `<div class="sec"><h2>Polls not open yet</h2><div class="m">The election officer has not opened voting. Check back soon.</div></div>`;
            else if (pend) b = `<div class="sec"><h2>Review your ballot</h2>${S.positions.map(p => `<div class="pl"><span class="tm" style="width:90px">${esc(p.title)}</span><div class="t">${esc(nm(p.id, pend[p.id]))}</div></div>`).join("")}<div class="row"><button data-a="back">Back</button><button class="p" data-a="cast">Confirm &amp; lock my vote</button></div><div class="hint">You cannot change your vote after this.</div></div>`;
            else b = `<div class="sec"><h2>Your ballot <em>one choice per post</em></h2>` + S.positions.map(p => `<div style="margin-bottom:18px"><b>${esc(p.title)}</b><div style="display:grid;gap:10px;margin-top:8px">` + [...p.cands, { id: "nota", name: "None of the above", bio: "Abstain for this post." }].map(c => `<label class="cand"><input type="radio" name="${p.id}" value="${c.id}"><span class="av">${esc(c.name[0])}</span><span><b>${esc(c.name)}</b><div class="m">${esc(c.bio || "")}</div></span></label>`).join("") + `</div></div>`).join("") + `<button class="p" data-a="review">Review ballot</button></div>`;
            return `<div class="stats" style="grid-template-columns:1fr 1fr"><div class="stat"><b>${esc(v.id)}</b><span>${esc(v.name)}</span></div><div class="stat"><b style="font-size:34px;padding-top:8px">${S.status == "open" ? "Open" : S.status == "closed" ? "Closed" : "Soon"}</b><span>Poll status · ${v.voted ? "you have voted" : "not voted yet"}</span></div></div>` + b
        }
        function adminV() {
            const n = S.voters.length, d = S.voters.filter(v => v.voted).length, pc = n ? Math.round(d / n * 100) : 0, up = S.status == "upcoming";
            return `<div class="m" style="margin-bottom:14px">Logged in as admin: <b style="color:var(--text)">${esc(U.name)}</b></div><div class="stats"><div class="stat"><b>${n}</b><span>Registered</span></div><div class="stat"><b>${d}</b><span>Voted</span></div><div class="stat"><b>${pc}%</b><span>Turnout</span></div><div class="stat"><b style="font-size:34px;padding-top:8px">${S.status}</b><span>Poll status</span></div></div>
<div class="layout"><div class="col"><div class="sec"><h2>Poll control</h2><div class="bar"><i style="width:${pc}%;background:linear-gradient(90deg,var(--c1),var(--c3))"></i></div><div class="row">${S.status == "upcoming" ? '<button class="p" data-a="open">Open polls</button>' : ""}${S.status == "open" ? '<button class="p" data-a="close">Close polls &amp; reveal</button>' : ""}<button data-a="reset">Reset demo data</button></div></div>
<div class="sec"><h2>Results <em>${S.status == "closed" ? "final" : "sealed"}</em></h2>${S.status == "closed" ? res() : '<div class="empty">Hidden until the polls close, so nobody can see a partial count.</div>'}</div>
<div class="sec"><h2>Audit log <em>no choices recorded</em></h2><div class="scroll">${S.log.map(l => `<div class="pl"><span class="m" style="width:150px">${esc(l.t)}</span><div class="t" style="font-weight:500">${esc(l.m)}</div></div>`).join("")}</div></div></div>
<div class="col"><div class="sec"><h2>Candidates ${up ? "" : "<em>locked</em>"}</h2>${S.positions.map(p => `<b>${esc(p.title)}</b>` + p.cands.map(c => `<div class="task"><span class="av" style="width:30px;height:30px">${esc(c.name[0])}</span><div class="t">${esc(c.name)}</div>${up ? `<button class="x" data-a="rc" data-d="${p.id}|${c.id}" aria-label="Remove">✕</button>` : ""}</div>`).join("")).join("")}
${up ? `<div style="margin-top:14px"><select id="cp" class="fi">${S.positions.map(p => `<option value="${p.id}">${esc(p.title)}</option>`).join("")}</select><input class="fi" id="cn" placeholder="Candidate name"><input class="fi" id="cb" placeholder="One-line manifesto"><button class="p" data-a="ac">Add candidate</button></div>` : ""}</div>
<div class="sec"><h2>Voter roll <em>status only</em></h2>${up ? `<div class="qa" style="margin-bottom:10px"><input id="vn" placeholder="New voter name"><button class="p" data-a="av">Add</button></div>` : ""}<div class="scroll">${S.voters.map(v => `<div class="pl"><span class="tm">${v.id}</span><div class="t" style="font-weight:500">${esc(v.name)}</div><span class="pill ${v.voted ? "Medium" : ""}">${v.voted ? "Voted" : "Pending"}</span></div>`).join("")}</div></div></div></div>`
        }
        function render() { $("out").hidden = !U; $("main").innerHTML = !U ? loginV() : U.role == "admin" ? adminV() : voterV() }
        function login() {
            const id = $("lid").value.trim(), pw = $("lpw").value;
            if (id.toLowerCase() == "anushka" && pw == "admin123") U = { role: "admin", name: "Anushka Pakhale" };
            else { const v = S.voters.find(x => x.id.toLowerCase() == id.toLowerCase() && x.pw == pw); if (!v) return toast("Invalid Voter ID or password"); U = { role: "voter", id: v.id } }
            pend = rcpt = null; render()
        }
        $("main").onkeydown = e => { if (e.key == "Enter" && e.target.id == "lpw") login() };
        $("main").onclick = e => {
            const b = e.target.closest("[data-a]"); if (!b) return; const a = b.dataset.a, d = b.dataset.d;
            if (a == "login") return login();
            if (a == "review") { const o = {}; for (const p of S.positions) { const r = document.querySelector(`input[name=${p.id}]:checked`); if (!r) return toast("Choose an option for " + p.title); o[p.id] = r.value } pend = o }
            if (a == "back") pend = null;
            if (a == "cast") {
                const v = S.voters.find(x => x.id == U.id); if (v.voted || S.status != "open") return toast("Voting not allowed");
                S.positions.forEach(p => S.votes.push({ pos: p.id, cand: pend[p.id] })); v.voted = true;
                rcpt = "BAL-" + Math.random().toString(36).slice(2, 8).toUpperCase(); pend = null; log("A ballot was cast"); save(); toast("Vote locked")
            }
            if (a == "open") { if (S.positions.some(p => !p.cands.length)) return toast("Every post needs a candidate"); S.status = "open"; log("Polls opened"); save() }
            if (a == "close") { S.status = "closed"; log("Polls closed, results revealed"); save() }
            if (a == "reset") { S = seed(); rcpt = null; save(); toast("Demo data reset") }
            if (a == "rc") { const [p, c] = d.split("|"), ps = S.positions.find(x => x.id == p); ps.cands = ps.cands.filter(x => x.id != c); save() }
            if (a == "ac") { const n = $("cn").value.trim(); if (!n) return toast("Enter a name"); S.positions.find(x => x.id == $("cp").value).cands.push({ id: "c" + Date.now(), name: n, bio: $("cb").value.trim() }); save() }
            if (a == "av") { const n = $("vn").value.trim(); if (!n) return toast("Enter a name"); S.voters.push({ id: "V" + (1001 + S.voters.length), name: n, pw: "vote123", voted: false }); log("Voter added to roll"); save() }
            render()
        };
        $("out").onclick = () => { U = pend = rcpt = null; render() };
        (function () {
            const r = document.documentElement; let t = "dark"; try { t = localStorage.getItem("ballot-theme") || "dark" } catch (e) { } r.dataset.theme = t;
            const flip = () => { t = r.dataset.theme == "dark" ? "light" : "dark"; r.dataset.theme = t; try { localStorage.setItem("ballot-theme", t) } catch (e) { } };
            $("theme").onclick = $("theme2").onclick = flip;
            const route = () => { const a = location.hash == "#app"; document.body.classList.toggle("in-app", a); window.scrollTo(0, 0); document.title = a ? "Ballot · Election" : "Ballot — Online Voting System" };
            addEventListener("hashchange", route); route();
            document.querySelectorAll("[data-s]").forEach(a => a.onclick = () => $(a.dataset.s).scrollIntoView({ behavior: "smooth" }));
            const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }), { threshold: .15 });
            document.querySelectorAll(".rv").forEach((e, i) => { e.style.transitionDelay = (i % 3) * 90 + "ms"; io.observe(e) })
        })();
        render();