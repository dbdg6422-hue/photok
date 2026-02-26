let posts = JSON.parse(localStorage.getItem("photok_posts")) || [];
let users = JSON.parse(localStorage.getItem("photok_users")) || {};
let currentUser = localStorage.getItem("photok_user");
let activePost = null;

/* SAVE */
function save(){
localStorage.setItem("photok_posts",JSON.stringify(posts));
localStorage.setItem("photok_users",JSON.stringify(users));
}

/* LOGIN */
function login(){
const name=document.getElementById("username").value.trim();
if(!name) return;
currentUser=name;
localStorage.setItem("photok_user",name);

if(!users[name])
users[name]={name:name,bio:"",pic:"👤"};

save();
init();
}

function init(){
const loginBox=document.getElementById("loginBox");
if(loginBox && currentUser) loginBox.style.display="none";
renderFeed();
renderProfile();
}

/* UPLOAD */
function toggleUpload(){
document.getElementById("uploadBox").classList.toggle("hidden");
}

function uploadPhoto(){
const file=document.getElementById("photoInput").files[0];
if(!file) return;

const title=document.getElementById("titleInput").value;
const desc=document.getElementById("descInput").value;

const reader=new FileReader();
reader.onload=e=>{
posts.unshift({
id:Date.now(),
user:currentUser,
img:e.target.result,
title,desc,
likes:[],
comments:[]
});
save();
renderFeed();
};
reader.readAsDataURL(file);
}

/* FEED */
function renderFeed(){
const feed=document.getElementById("feed");
if(!feed) return;

feed.innerHTML="";

posts.forEach(p=>{
const liked=p.likes.includes(currentUser);

const div=document.createElement("div");
div.className="post";

div.innerHTML=`
<img src="${p.img}" onclick="viewImg('${p.img}')">
<div class="postBody">
<b onclick="openProfile('${p.user}')">@${p.user}</b>
<h3>${p.title||""}</h3>
<p>${p.desc||""}</p>

<div class="actions">
<button class="likeBtn ${liked?'liked':''}" onclick="likePost(${p.id})">
❤️ ${p.likes.length}
</button>
<button class="iconBtn" onclick="openComments(${p.id})">💬</button>
</div>

</div>
`;

feed.appendChild(div);
});
}

function likePost(id){
const p=posts.find(x=>x.id===id);
if(!p) return;

if(p.likes.includes(currentUser))
p.likes=p.likes.filter(u=>u!==currentUser);
else
p.likes.push(currentUser);

save();
renderFeed();
}

/* IMAGE VIEW */
function viewImg(src){
document.getElementById("viewerImg").src=src;
document.getElementById("viewer").classList.remove("hidden");
}

function closeViewer(){
document.getElementById("viewer").classList.add("hidden");
}

/* COMMENTS */
function openComments(id){
activePost=id;
document.getElementById("commentsModal").classList.remove("hidden");
renderComments();
}

function closeComments(){
document.getElementById("commentsModal").classList.add("hidden");
}

function renderComments(){
const list=document.getElementById("commentsList");
const p=posts.find(x=>x.id===activePost);
if(!p) return;

list.innerHTML="";

if(p.comments.length===0){
list.innerHTML="<p>No comments</p>";
return;
}

p.comments.forEach(c=>{
const row=document.createElement("p");
row.innerHTML=`<b>@${c.user}</b> ${c.text}`;
list.appendChild(row);
});
}

function addComment(){
const input=document.getElementById("commentInput");
const text=input.value.trim();
if(!text) return;

const p=posts.find(x=>x.id===activePost);
p.comments.push({user:currentUser,text});

input.value="";
save();
renderComments();
}

/* PROFILE NAV */
function goMyProfile(){
location.href="profile.html?user="+currentUser;
}

function openProfile(u){
location.href="profile.html?user="+u;
}

function goHome(){
location.href="index.html";
}

/* PROFILE */
function getQueryUser(){
const params=new URLSearchParams(location.search);
return params.get("user");
}

function renderProfile(){
const feed=document.getElementById("profileFeed");
if(!feed) return;

const user=getQueryUser();
if(!user) return;

document.getElementById("profileName").innerText="@"+user;

const info=document.getElementById("profileInfo");
if(info){
info.innerHTML=`
<b>${users[user]?.name||user}</b>
<p>${users[user]?.bio||""}</p>
`;
}

const pic=document.getElementById("profilePic");
if(pic) pic.innerText=users[user]?.pic||"👤";

feed.innerHTML="";

posts.filter(p=>p.user===user).forEach(p=>{
const div=document.createElement("div");
div.className="post";

let del="";
if(user===currentUser)
del=`<button class="iconBtn" onclick="deletePost(${p.id})">🗑</button>`;

div.innerHTML=`
<img src="${p.img}" onclick="viewImg('${p.img}')">
<div class="postBody">
<h3>${p.title||""}</h3>
<p>${p.desc||""}</p>
${del}
</div>
`;

feed.appendChild(div);
});
}

function deletePost(id){
posts=posts.filter(p=>p.id!==id);
save();
renderProfile();
}

/* EDIT PROFILE */
function editProfile(){
const user=getQueryUser();
if(user!==currentUser) return;

const name=prompt("Name",users[user].name);
const bio=prompt("Bio",users[user].bio);

if(name!==null) users[user].name=name;
if(bio!==null) users[user].bio=bio;

save();
renderProfile();
}

const profileInput=document.getElementById("profileInput");
if(profileInput){
profileInput.onchange=e=>{
users[currentUser].pic="🖼️";
save();
renderProfile();
};
}

/* INIT */
init();