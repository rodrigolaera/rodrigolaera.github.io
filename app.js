(function(){
  var $=function(s){return document.querySelector(s)};
  var D=window, S=D.SITE||{}, A=D.ARTICLES;
  var meta=document.querySelector('meta[name="page-lang"]');
  var LANG=(meta&&meta.content)||"es"; if(!D.I18N[LANG])LANG="es";
  var L=D.I18N[LANG], X=(D.I18N_DATA[LANG]||{});
  var T=L.topics;
  var get=function(o,p){return p.split(".").reduce(function(a,k){return a&&a[k]},o)};
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
  var link=function(l){return !l?"":(/^10\./.test(l)?"https://doi.org/"+l:l)};
  var isDoi=function(l){return /^10\./.test(l||"")};
  A.forEach(function(a,i){a.id=i});
  var termOf=function(a){return "laera: "+a[1]+" "+a[2]};

  // Textos estáticos
  document.querySelectorAll("[data-i]").forEach(function(el){el.textContent=get(L,el.dataset.i)});
  $("#q").placeholder=L.search; $("#q").setAttribute("aria-label",L.search);
  $("#theme").setAttribute("aria-label",L.theme);
  var lb=$("#lang"); lb.textContent=L.langBtn; lb.title=L.langTitle;
  var tb=document.querySelectorAll("#tabs button"); tb.forEach(function(b){b.textContent=L.tabs[b.dataset.tab]});

  // Estadísticas y áreas
  var nums=[A.length,D.BOOKS.length,D.CHAPTERS.length,2];
  $("#stats").innerHTML=nums.map(function(n,i){return "<div><dt>"+n+"</dt><dd>"+L.stats[i]+"</dd></div>"}).join("");
  $("#areas").innerHTML=["epi","eco","eth"].map(function(k){
    var n=A.filter(function(a){return a[0]===k}).length;
    return '<div class="card"><h3>'+T[k]+'</h3><p>'+L.blurbs[k]+'</p><button type="button" data-topic="'+k+'">'+L.nArticles(n)+'</button></div>';
  }).join("");

  // Filtros
  var tsel=$("#topic"), ysel=$("#year"), oa=$("#oa");
  tsel.add(new Option(L.allTopics,"")); Object.keys(T).forEach(function(k){tsel.add(new Option(T[k],k))});
  ysel.add(new Option(L.allYears,""));
  Array.from(new Set(A.map(function(a){return a[1]}))).sort(function(a,b){return b-a}).forEach(function(y){ysel.add(new Option(y,y))});
  if(A.some(function(a){return a[7]}))$("#oa-wrap").hidden=false;

  // Citas
  var STOP={the:1,los:1,las:1,una:1,del:1,con:1,que:1,para:1,and:1,of:1,in:1,a:1,el:1,la:1,de:1,un:1};
  function ascii(s){return s.normalize("NFD").replace(/[̀-ͯ]/g,"")}
  function parseDetail(d){
    var m={vol:"",issue:"",pages:"",press:/prensa/i.test(d)};
    if(m.press)return m;
    var p=d.match(/pp\.\s*([\d]+-?[\d]*)/); if(p)m.pages=p[1];
    var rest=d.replace(/,?\s*pp\..*$/,"").trim();
    var art=rest.match(/,\s*(e\d+)$/); if(art){m.pages=art[1];rest=rest.replace(/,\s*e\d+$/,"")}
    var v=rest.match(/^([^\s(,]+)\s*(?:\(([^)]+)\))?/); if(v){m.vol=v[1];m.issue=v[2]||""}
    return m;
  }
  function authors(a){return a[6]?["Laera, R.","Klein, W."]:["Laera, R."]}
  function apa(a){
    var m=parseDetail(a[4]), au=authors(a), who=au.length>1?au[0]+", & "+au[1]:au[0];
    var yr=m.press?L.apaInPress:a[1];
    var vol=m.vol?", "+m.vol+(m.issue?"("+m.issue+")":""):"";
    var pg=m.pages?", "+m.pages.replace("-","–"):"";
    var url=a[5]?" "+link(a[5]):"";
    var t=a[2].replace(/[.?!]$/,"");
    var end=/[?!]$/.test(a[2])?"":".";
    return {html:esc(who)+" ("+esc(yr)+"). "+esc(a[2].replace(/[.]$/,""))+end+" <i>"+esc(a[3])+"</i>"+esc(vol)+esc(pg)+"."+esc(url),
            text:who+" ("+yr+"). "+t+end+" "+a[3]+vol+pg+"."+url};
  }
  function bibtex(a){
    var m=parseDetail(a[4]);
    var w=ascii(a[2]).toLowerCase().split(/[^a-z0-9]+/).filter(function(x){return x&&!STOP[x]})[0]||"paper";
    var f=[["author",a[6]?"Laera, Rodrigo and Klein, Walter":"Laera, Rodrigo"],["title","{"+a[2]+"}"],["journal",a[3]],["year",a[1]]];
    if(m.vol)f.push(["volume",m.vol]); if(m.issue)f.push(["number",m.issue]);
    if(m.pages)f.push(["pages",m.pages.replace("-","--")]);
    if(isDoi(a[5]))f.push(["doi",a[5]]); else if(a[5])f.push(["url",a[5]]);
    if(m.press)f.push(["note","In press"]);
    return "@article{laera"+a[1]+w+",\n"+f.map(function(x){return "  "+x[0]+" = {"+x[1]+"}"}).join(",\n")+"\n}";
  }

  var tab="art";
  function card(year,title,venue,detail,url,topic,a,extra,pdf){
    var h='<article class="item"><div class="yr">'+year+'</div><div><h4>'+esc(title)+'</h4><div class="meta">';
    h+=venue?"<em>"+esc(venue)+"</em>":"";
    h+=detail?(venue?" · ":"")+esc(detail):"";
    h+=extra?" · "+esc(extra):"";
    h+='</div><div class="row">';
    if(topic)h+='<span class="chip">'+T[topic]+'</span>';
    if(pdf)h+='<span class="chip oa">'+L.oa+'</span><a href="'+esc(pdf)+'" target="_blank" rel="noopener">'+L.pdf+'</a>';
    var u=link(url); if(u)h+='<a href="'+esc(u)+'" target="_blank" rel="noopener">'+L.view+'</a>';
    if(a){h+='<button type="button" data-cite="'+a.id+'" aria-expanded="false">'+L.cite+'</button>';
          h+='<button type="button" data-thread="'+a.id+'">'+L.discuss+'</button>'}
    h+='</div>';
    if(a){var c=apa(a);
      h+='<div class="cite" id="cite-'+a.id+'" hidden>'+
        '<div class="cite-h"><b>'+L.apa+'</b><button type="button" data-copy="apa" data-id="'+a.id+'">'+L.copy+'</button></div><p class="cite-t">'+c.html+'</p>'+
        '<div class="cite-h"><b>'+L.bib+'</b><button type="button" data-copy="bib" data-id="'+a.id+'">'+L.copy+'</button></div><pre class="cite-t">'+esc(bibtex(a))+'</pre></div>';}
    return h+'</div></article>';
  }
  function detailOf(a){return /prensa/i.test(a[4])?L.inPress:a[4]}
  function render(){
    var q=$("#q").value.trim().toLowerCase(), tp=tsel.value, yr=ysel.value, out=[], n=0;
    $("#filters").style.display=tab==="art"?"":"none";
    if(tab==="art"){
      A.forEach(function(a){
        if(tp&&a[0]!==tp)return; if(yr&&String(a[1])!==yr)return; if(oa.checked&&!a[7])return;
        if(q&&(a[2]+" "+a[3]).toLowerCase().indexOf(q)<0)return;
        n++; out.push(card(a[1],a[2],a[3],detailOf(a),a[5],a[0],a,a[6]?(LANG==="en"?"with ":"con ")+a[6].replace(/^con /,""):"",a[7]));
      });
      $("#count").textContent=L.countArt(n,A.length);
    }else if(tab==="book"){
      D.BOOKS.forEach(function(b,i){var d=(X.BOOKS&&X.BOOKS[i])?X.BOOKS[i].detail:b.detail;out.push(card(b.year,b.title,b.venue,d,"",null,null))});
      $("#count").textContent=L.countBook(D.BOOKS.length);
    }else{
      D.CHAPTERS.forEach(function(c){out.push(card(c[0],c[1],c[2],"",c[3],null,null))});
      $("#count").textContent=L.countChap(D.CHAPTERS.length);
    }
    $("#list").innerHTML=out.join("")||'<p class="notice">'+L.none+'</p>';
  }
  $("#q").addEventListener("input",render);[tsel,ysel,oa].forEach(function(el){el.addEventListener("change",render)});
  $("#tabs").addEventListener("click",function(e){
    var b=e.target.closest("button"); if(!b)return; tab=b.dataset.tab;
    tb.forEach(function(x){x.classList.toggle("on",x===b)}); render();
  });
  $("#areas").addEventListener("click",function(e){
    var b=e.target.closest("button"); if(!b)return;
    tab="art"; tb.forEach(function(x){x.classList.toggle("on",x.dataset.tab==="art")});
    tsel.value=b.dataset.topic; $("#q").value=""; ysel.value=""; oa.checked=false; render();
    $("#publicaciones").scrollIntoView();
  });

  // Copiar citas
  function copyText(txt,btn,node){
    var done=function(){var o=btn.textContent;btn.textContent=L.copied;setTimeout(function(){btn.textContent=o},1400)};
    var fallback=function(){var r=document.createRange();r.selectNodeContents(node);var s=getSelection();s.removeAllRanges();s.addRange(r)};
    try{navigator.clipboard.writeText(txt).then(done,fallback)}catch(e){fallback()}
  }
  $("#list").addEventListener("click",function(e){
    var b=e.target.closest("button"); if(!b)return;
    if(b.dataset.cite!=null){var p=$("#cite-"+b.dataset.cite);p.hidden=!p.hidden;b.setAttribute("aria-expanded",String(!p.hidden));return}
    if(b.dataset.copy){var a=A[+b.dataset.id],node=b.closest(".cite-h").nextElementSibling;
      copyText(b.dataset.copy==="apa"?apa(a).text:bibtex(a),b,node);return}
    if(b.dataset.thread!=null){thread.value=String(b.dataset.thread); if(io)io.disconnect(); loadForum(); $("#foro").scrollIntoView()}
  });

  // Trayectoria
  function tl(k,arr,fn){return arr.map(function(x,i){var o=Object.assign({},x,(X[k]&&X[k][i])||{});return "<li>"+fn(o)+"</li>"}).join("")}
  $("#edu").innerHTML=tl("EDUCATION",D.EDUCATION,function(e){return '<span class="when">'+e.year+'</span><b>'+esc(e.title)+'</b><small>'+esc(e.place)+'</small>'+(e.note?'<small>'+esc(e.note)+'</small>':"")});
  $("#pos").innerHTML=tl("POSITIONS",D.POSITIONS,function(e){return '<span class="when">'+e.year+'</span><b>'+esc(e.title)+'</b><small>'+esc(e.place)+'</small><small>'+esc(e.note)+'</small>'});
  $("#proj").innerHTML=tl("PROJECTS",D.PROJECTS,function(e){return '<span class="when">'+e.year+'</span><b>'+esc(e.title)+'</b><small>'+esc(e.role)+' · '+esc(e.ref)+'</small>'});
  var gr=(X.GRANTS||D.GRANTS);
  $("#grants").innerHTML=gr.map(function(g){return "<li>"+esc(g)+"</li>"}).join("");
  $("#talks-sum").textContent=L.talksSum(D.TALKS.length);
  $("#talks").innerHTML=D.TALKS.map(function(t){return "<li><b>"+esc(t[1])+"</b><br>"+t[0]+" · "+esc(t[2])+"</li>"}).join("");

  // Foro (giscus)
  var thread=$("#thread");
  thread.add(new Option(L.general,"general"));
  A.forEach(function(a){thread.add(new Option(a[1]+" · "+a[2].slice(0,90)+(a[2].length>90?"…":""),String(a.id)))});
  function loadForum(){
    var g=S.giscus||{}, box=$("#giscus-box"); box.innerHTML="";
    if(!g.repo||!g.repoId||!g.categoryId){
      box.innerHTML='<div class="notice">'+L.forumSoon+' <a href="mailto:rodrigolaera@gmail.com">rodrigolaera@gmail.com</a>.</div>'; return;
    }
    var term=thread.value==="general"?"laera: discusión general":termOf(A[+thread.value]);
    var s=document.createElement("script"); s.src="https://giscus.app/client.js"; s.async=true; s.crossOrigin="anonymous";
    var at={"data-repo":g.repo,"data-repo-id":g.repoId,"data-category":g.category||"Foro","data-category-id":g.categoryId,
      "data-mapping":"specific","data-term":term,"data-strict":"0","data-reactions-enabled":"1","data-emit-metadata":"0",
      "data-input-position":"top","data-theme":"preferred_color_scheme","data-lang":LANG,"data-loading":"lazy"};
    Object.keys(at).forEach(function(k){s.setAttribute(k,at[k])}); box.appendChild(s);
  }
  thread.addEventListener("change",loadForum);
  var io=("IntersectionObserver" in window)?new IntersectionObserver(function(en){if(en[0].isIntersecting){io.disconnect();loadForum()}},{rootMargin:"300px"}):null;
  if(io)io.observe($("#foro")); else loadForum();

  // Perfiles
  var P=S.profiles||{}, names={orcid:"ORCID",philpapers:"PhilPapers",repec:"RePEc",conicet:"CONICET Digital"}, pl=[];
  if(S.scholarUrl)pl.push([L.scholar,S.scholarUrl]);
  Object.keys(names).forEach(function(k){if(P[k])pl.push([names[k],P[k]])});
  if(pl.length){$("#profiles").hidden=false;$("#profile-links").innerHTML=pl.map(function(p){return '<a class="btn" href="'+esc(p[1])+'" target="_blank" rel="noopener me">'+p[0]+' ↗</a>'}).join("")}

  // SEO: canonical, hreflang y datos estructurados
  (function(){
    var base=(S.siteUrl||"").replace(/\/$/,""), h=document.head, g=function(t,attrs){var e=document.createElement(t);Object.keys(attrs).forEach(function(k){e.setAttribute(k,attrs[k])});h.appendChild(e)};
    var es=meta&&meta.dataset.es, en=meta&&meta.dataset.en;
    if(base&&es&&en){
      var cur=LANG==="en"?en:es;
      g("link",{rel:"canonical",href:base+"/"+cur});
      g("link",{rel:"alternate",hreflang:"es",href:base+"/"+es});
      g("link",{rel:"alternate",hreflang:"en",href:base+"/"+en});
      g("link",{rel:"alternate",hreflang:"x-default",href:base+"/"+es});
      g("meta",{property:"og:url",content:base+"/"+cur});
    }
    var same=pl.map(function(p){return p[1]});
    var person={"@type":"Person","@id":(base||"")+"#rodrigo-laera",name:"Rodrigo Laera",jobTitle:LANG==="en"?"Assistant Researcher":"Investigador Adjunto",
      worksFor:{"@type":"Organization",name:"CONICET"},alumniOf:[{"@type":"CollegeOrUniversity",name:"Universitat de Barcelona"},{"@type":"CollegeOrUniversity",name:"Universidad Nacional de General Sarmiento"}],
      knowsAbout:["Epistemology","Philosophy of economics","Rationality","Epistemic injustice"],sameAs:same};
    if(base)person.url=base+"/";
    var graph=[person].concat(A.map(function(a){
      var o={"@type":"ScholarlyArticle",headline:a[2],name:a[2],datePublished:String(a[1]),inLanguage:/[áéíóúñ]|\b(el|la|los|de|del|y)\b/i.test(a[2])?"es":"en",
        author:[{"@id":(base||"")+"#rodrigo-laera"}].concat(a[6]?[{"@type":"Person",name:"Walter Klein"}]:[]),
        isPartOf:{"@type":"Periodical",name:a[3]}};
      if(isDoi(a[5])){o.sameAs="https://doi.org/"+a[5];o.identifier={"@type":"PropertyValue",propertyID:"DOI",value:a[5]}}else if(a[5])o.url=a[5];
      if(a[7])o.isAccessibleForFree=true;
      return o;
    }));
    var js=document.createElement("script"); js.type="application/ld+json"; js.textContent=JSON.stringify({"@context":"https://schema.org","@graph":graph}); h.appendChild(js);
  })();

  $("#yr").textContent=new Date().getFullYear();
  $("#theme").addEventListener("click",function(){
    var cur=document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");
    var nx=cur==="dark"?"light":"dark"; document.documentElement.dataset.theme=nx;
    try{localStorage.setItem("theme",nx)}catch(e){}
  });
  render();
})();
