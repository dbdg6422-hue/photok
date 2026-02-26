let posts = JSON.parse(localStorage.getItem("photok_posts")) || [];
let users = JSON.parse(localStorage.getItem("photok_users")) || {};
let currentUser = localStorage.getItem("photok_user");

function save(){
localStorage.setItem("photok_posts",JSON.stringify(posts));
localStorage.setItem("photok_users",JSON.stringify(users));
}

function login(){
const name=document.getElementById("username").value.trim();
if(!name) return;
currentUser=name;
localStorage.setItem("photok_user",name);
if(!users[name]) users[name]={pic:"👤"};
save();
init();
}

function init(){
const loginBox=document.getElementById("loginBox");
if(loginBox && currentUser) loginBox.style.display="none";
renderFeed();
renderProfile();
}

function showUpload(){
const u=document.getElementById("uploadBox");
if(u) u.classList.toggle("hidden");
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
likes:[]
});
save();
renderFeed();
};
reader.readAsDataURL(file);
}

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
<button class="likeBtn ${liked?'liked':''}" onclick="likePost(${p.id})">Like</button>
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

function viewImg(src){
const v=document.getElementById("viewer");
const img=document.getElementById("viewerImg");
if(!v||!img) return;
img.src=src;
v.classList.remove("hidden");
}

function closeViewer(){
const v=document.getElementById("viewer");
if(v) v.classList.add("hidden");
}

function goMyProfile(){
location.href="profile.html?user="+currentUser;
}

function openProfile(u){
location.href="profile.html?user="+u;
}

function goHome(){
location.href="index.html";
}

function getQueryUser(){
const params=new URLSearchParams(location.search);
return params.get("user");
}

function renderProfile(){
const page=document.getElementById("profileFeed");
if(!page) return;

const user=getQueryUser();
if(!user) return;

const name=document.getElementById("profileName");
if(name) name.innerText="@"+user;

const pic=document.getElementById("profilePic");
if(pic) pic.innerText=(users[user]?.pic)||"👤";

page.innerHTML="";

posts.filter(p=>p.user===user).forEach(p=>{
const div=document.createElement("div");
div.className="post";

let del="";
if(user===currentUser){
del=`<button onclick="deletePost(${p.id})">Delete</button>`;
}

div.innerHTML=`
<img src="${p.img}" onclick="viewImg('${p.img}')">
<div class="postBody">
<h3>${p.title||""}</h3>
<p>${p.desc||""}</p>
${del}
</div>
`;
page.appendChild(div);
});
}

function deletePost(id){
posts=posts.filter(p=>p.id!==id);
save();
renderProfile();
}

function editProfile(){
const user=getQueryUser();
if(user!==currentUser) return;
document.getElementById("profileInput").click();
}

const profileInput=document.getElementById("profileInput");
if(profileInput){
profileInput.onchange=e=>{
const file=e.target.files[0];
if(!file) return;
users[currentUser].pic="🖼️";
save();
renderProfile();
};
}

init();