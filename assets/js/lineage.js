/* =============================================================
   Sigma Lambda Lineage (lineage.html)
   The chapter family tree, rebuilt from sigma-lambda-lineage.vercel.app
   in plain JS so it sits inside the site's own header, Silk hero and
   footer. Three views: By house, Full lineage (zoom, search, house
   fly-to, full screen) and By class (group by class, name, major,
   year or house). Tap a brother to trace his line to the founder.

   To update the tree, edit the data below:
   MEMBERS: big is a name, an array of names (shared littles) or null
   (patriarch under the founder). adopted: true draws a dashed line.
   twin: name of twin brother. List co-bigs next to each other.
   CLASSES: names exactly as they appear in MEMBERS.
   ============================================================= */
(function () {
  "use strict";

  // ---------- Data (copied from the original page) ----------
  var INFO = {
    mccarty: {"clan":"Clan MacCarthy","motto":"Forti et fideli nihil difficile","mottoEn":"To the brave and faithful, nothing is difficult","tartan":"Turquoise Blue, Green, and Red"},
    wilson: {"clan":"Clan Wilson","motto":"Vincit qui se vincit","mottoEn":"He conquers who conquers himself","tartan":"Green, Red, and Navy Blue with white windowpanes"},
    elliott: {"clan":"Clan Elliot","motto":"Fortiter et recte","mottoEn":"With strength and right / Boldly and rightly","tartan":"Deep Blue, Black, and Red checks"},
    gregg: {"clan":"Clan Gregor / MacGregor","motto":"S'rioghal mo dhream","mottoEn":"Loyal is my heart","tartan":"Vibrant Red, Forest Green, and Black"},
    crofts: {"clan":"Croft / Crofter","motto":"Esse quam videri","mottoEn":"To be, rather than to seem","tartan":"Deep Blue and Green base with thin white/red over-checks"},
    fletcher: {"clan":"Clan Fletcher","motto":"Dieu pour nous","mottoEn":"God for us","tartan":"Forest Green, Royal Blue, Red, and Black lines"},
  };
  var DIRECTORY = {"Aspen Ames":{"major":"Finance","year":"2028","standing":"Junior"},"Sage Ames":{"major":"Undeclared","year":"2028","standing":"Junior"},"Ryan Barrie":{"major":"Kinesiology","year":"2028","standing":"Junior"},"Drew Barth":{"major":"Law","year":"2028","standing":"Junior"},"Tyler Binn":{"major":"Business Administration","year":"2028","standing":"Junior"},"Nicholas Braver":{"major":"Business","year":"2028","standing":"Junior"},"Reilly Capraro":{"major":"Finance","year":"2028","standing":"Junior"},"Camden Chavez":{"major":"Biology","year":"2027","standing":"Senior"},"Tyler Chobanian":{"major":"Business Administration","year":"2029","standing":"Sophomore"},"Cody Dickinson":{"major":"Accounting","year":"2028","standing":"Junior"},"Casey Dittmer":{"major":"Parks Recreation and Tourism","year":"2028","standing":"Junior"},"Evan Eaton":{"major":"Business","year":"2028","standing":"Junior"},"Jared Edwards":{"major":"Accounting","year":"2029","standing":"Sophomore"},"Jaxon Enriquez":{"major":"Business","year":"2029","standing":"Sophomore"},"Zack Foulon":{"major":"Computer Science","year":"2029","standing":"Sophomore"},"Tolan Friesen":{"major":"Finance","year":"2027","standing":"Senior"},"Blair Gibson":{"major":"QAMO","year":"2028","standing":"Junior"},"Daniel Gilmor":{"major":"Business","year":"2029","standing":"Sophomore"},"Max Goldberg":{"major":"Finance","year":"2028","standing":"Junior"},"Alex Guastella":{"major":"Business","year":"2027","standing":"Senior"},"Quincy Guerzon":{"major":"Kinesiology","year":"2028","standing":"Junior"},"Grant Hall":{"major":"Business","year":"2028","standing":"Junior"},"Miles Hall":{"major":"Finance","year":"2027","standing":"Senior"},"Garrett Hansen":{"major":"Finance, Economics","year":"2029","standing":"Sophomore"},"Tyler Hickman":{"major":"Business Administration","year":"2028","standing":"Junior"},"Colton Komar":{"major":"Biomedical Engineering","year":"2028","standing":"Junior"},"Rocco Kuykendall":{"major":"Finance","year":"2029","standing":"Sophomore"},"Cooper Lagsdin":{"major":"EMS","year":"2029","standing":"Sophomore"},"Jayden Leithead":{"major":"Economics","year":"2028","standing":"Junior"},"Cameron Lentz":{"major":"Business Administration, International Relations","year":"2029","standing":"Sophomore"},"Carson Lolli":{"major":"Business Administration","year":"2028","standing":"Junior"},"Kian Lowry":{"major":"Business","year":"2028","standing":"Junior"},"Grady Lynch":{"major":"Undeclared","year":"2029","standing":"Sophomore"},"Noah Marcus":{"major":"Communications","year":"2028","standing":"Junior"},"Nico Martin":{"major":"Operations & Supply Chain","year":"2027","standing":"Senior"},"Mason Mautino":{"major":"Business","year":"2028","standing":"Junior"},"Greyson Megard":{"major":"Mechanical Engineering","year":"2029","standing":"Sophomore"},"Jacob Neely":{"major":"Biology","year":"2028","standing":"Junior"},"Bennett Nicastro":{"major":"Business","year":"2028","standing":"Junior"},"Owen Ostrom":{"major":"Accounting","year":"2028","standing":"Junior"},"Nick Ouellette":{"major":"Entrepreneurship","year":"2029","standing":"Sophomore"},"Jackson Price":{"major":"Finance","year":"2028","standing":"Junior"},"Ethan Quiocho":{"major":"Pre Nursing","year":"2029","standing":"Sophomore"},"Luca Repetti":{"major":"Business","year":"2029","standing":"Sophomore"},"Brady Richardson":{"major":"Business","year":"2029","standing":"Sophomore"},"Cruz Rivera":{"major":"Finance","year":"2028","standing":"Junior"},"Trevor Sivo":{"major":"Business Administration","year":"2027","standing":"Senior"},"Charlie Skok":{"major":"Business","year":"2028","standing":"Junior"},"Jacob Steinberger":{"major":"Finance","year":"2027","standing":"Senior"},"Corbin Towery":{"major":"Multidisciplinary Design","year":"2028","standing":"Junior"},"Zach Tragakis":{"major":"QAMO, Computer Science","year":"2027","standing":"Senior"},"Grant Turley":{"major":"Biology","year":"2027","standing":"Senior"},"Adam Underhill":{"major":"Parks Recreation and Tourism","year":"2028","standing":"Junior"},"Jacob Weber":{"major":"Business","year":"2029","standing":"Sophomore"},"Jack White":{"major":"Finance","year":"2029","standing":"Sophomore"},"Tristan Winn":{"major":"Communications","year":"2027","standing":"Senior"},"Brody Zylstra":{"major":"Business","year":"2029","standing":"Sophomore"},"Mark Beatty":{"major":"Business","year":"2029","standing":"Sophomore"},"David Bickerstaff":{"major":"Architecture","year":"2029","standing":"Sophomore"},"Owen Bradley":{"major":"Business","year":"2029","standing":"Sophomore"},"Owen Dearborn":{"major":"Business","year":"2029","standing":"Sophomore"},"Noah Hermsen":{"major":"Finance","year":"2029","standing":"Sophomore"},"Lukas Kennett":{"major":"Bioinformatics","year":"2028","standing":"Junior"},"Miles Lambert":{"major":"Economics, Finance","year":"2029","standing":"Sophomore"},"Gavin Lawyer":{"major":"Finance","year":"2029","standing":"Sophomore"},"Andrew Lotterman":{"major":"Civil Engineering","year":"2029","standing":"Sophomore"},"Donnie Marino":{"major":"Kinesiology","year":"2029","standing":"Sophomore"},"Will Michel":{"major":"Biology","year":"2029","standing":"Sophomore"},"Brock Peterson":{"major":"Kinesiology","year":"2029","standing":"Sophomore"},"Eli Primosch":{"major":"Biology","year":"2029","standing":"Sophomore"},"Jackson Ratner":{"major":"Biology","year":"2029","standing":"Sophomore"},"Tripp Riley":{"major":"Architecture","year":"2028","standing":"Junior"},"Rohab Shameem":{"major":"Finance","year":"2029","standing":"Sophomore"},"Ian Stubbs":{"major":"Business Administration","year":"2028","standing":"Junior"},"Alex Sule":{"major":"Finance","year":"2029","standing":"Sophomore"},"Ty Webb":{"major":"Civil Engineering","year":"2029","standing":"Sophomore"},"Jackson Brick":{"major":"Finance","year":"2030","standing":"Freshman"},"Owen Rabinowitz":{"major":"QAMO","year":"2030","standing":"Freshman"},"Cardin Nguyen":{"year":"2030","standing":"Freshman"},"Griffin Sevier":{"year":"2030","standing":"Freshman"},"Kevin Spoon":{"year":"2030","standing":"Freshman"},"Will Totten":{"year":"2030","standing":"Freshman"},"Charlie Keckemet":{"year":"2030","standing":"Freshman"},"Michael Gorelick":{"year":"2030","standing":"Freshman"},"Duke Parker":{"year":"2030","standing":"Freshman"},"Will Erickson":{"year":"2030","standing":"Freshman"},"Reece Fogg":{"year":"2030","standing":"Freshman"},"Dylan Muir":{"year":"2030","standing":"Freshman"},"Michael Maciolek":{"year":"2030","standing":"Freshman"},"Ascher Drummet":{"year":"2030","standing":"Freshman"},"Kenny Maciolek":{"year":"2030","standing":"Freshman"},"Kye Sivo":{"year":"2030","standing":"Freshman"},"PJ Stratton":{"year":"2030","standing":"Freshman"},"Spider Schlopy":{"year":"2030","standing":"Freshman"},"Avery Vihinen":{"year":"2030","standing":"Freshman"},"Grey Robinson":{"year":"2030","standing":"Freshman"},"Reid Klecka":{"year":"2030","standing":"Freshman"},"Brian Roberts":{"year":"2030","standing":"Freshman"},"Jack Cecil":{"year":"2030","standing":"Freshman"},"Joey Lennon":{"year":"2030","standing":"Freshman"},"Wade Wright":{"year":"2030","standing":"Freshman"},"Taylor Bandy":{"year":"2030","standing":"Freshman"},"James Matthews":{"year":"2030","standing":"Freshman"},"Damon Epstein":{"major":"Criminology","year":"2030","standing":"Freshman"},"Nate Shuler":{"year":"2030","standing":"Freshman"},"Corban Fischbach":{"year":"2030","standing":"Freshman"},"Brady Dobson":{"year":"2030","standing":"Freshman"},"Nick Hvatum":{"year":"2029","standing":"Sophomore"}};
  var CLASSES = [
    { key: 'act25', name: 'Fall 2025', kicker: 'Fall 2025', members: ["Aspen Ames","Sage Ames","Ryan Barrie","Drew Barth","Tyler Binn","Nicholas Braver","Reilly Capraro","Camden Chavez","Tyler Chobanian","Cody Dickinson","Casey Dittmer","Evan Eaton","Jared Edwards","Jaxon Enriquez","Zack Foulon","Tolan Friesen","Blair Gibson","Daniel Gilmor","Max Goldberg","Alex Guastella","Quincy Guerzon","Grant Hall","Miles Hall","Garrett Hansen","Tyler Hickman","Colton Komar","Rocco Kuykendall","Cooper Lagsdin","Jayden Leithead","Cameron Lentz","Carson Lolli","Kian Lowry","Grady Lynch","Noah Marcus","Nico Martin","Mason Mautino","Greyson Megard","Jacob Neely","Bennett Nicastro","Owen Ostrom","Nick Ouellette","Jackson Price","Ethan Quiocho","Luca Repetti","Brady Richardson","Cruz Rivera","Trevor Sivo","Charlie Skok","Jacob Steinberger","Corbin Towery","Zach Tragakis","Grant Turley","Adam Underhill","Jacob Weber","Jack White","Tristan Winn","Brody Zylstra"] },
    { key: 'spr26', name: 'Spring 2026', kicker: 'Spring 2026', members: ["Mark Beatty","David Bickerstaff","Owen Bradley","Owen Dearborn","Noah Hermsen","Lukas Kennett","Miles Lambert","Gavin Lawyer","Andrew Lotterman","Donnie Marino","Will Michel","Brock Peterson","Eli Primosch","Jackson Ratner","Tripp Riley","Rohab Shameem","Ian Stubbs","Alex Sule","Ty Webb"] },
    { key: 'fall26', name: 'Fall 2026', kicker: 'Fall 2026', members: ["Cardin Nguyen","Griffin Sevier","Kevin Spoon","Will Totten","Charlie Keckemet","Michael Gorelick","Duke Parker","Will Erickson","Reece Fogg","Dylan Muir","Michael Maciolek","Ascher Drummet","Kenny Maciolek","Kye Sivo","PJ Stratton","Spider Schlopy","Avery Vihinen","Grey Robinson","Reid Klecka","Brian Roberts","Jack Cecil","Joey Lennon","Wade Wright","Nick Hvatum","Taylor Bandy","James Matthews","Damon Epstein","Nate Shuler","Corban Fischbach","Owen Rabinowitz","Brady Dobson","Jackson Brick"] },
  ];
  var MEMBERS = [
    { house: 'mccarty', name: 'Quincy Guerzon', big: null },
    { house: 'mccarty', name: 'Luca Repetti', big: 'Quincy Guerzon' },
    { house: 'mccarty', name: 'James Matthews', big: 'Luca Repetti' },
    { house: 'mccarty', name: 'Ethan Quiocho', big: 'Quincy Guerzon', adopted: true },
    { house: 'mccarty', name: 'Grey Robinson', big: 'Ethan Quiocho' },
    { house: 'mccarty', name: 'Camden Chavez', big: null },
    { house: 'mccarty', name: 'Gavin Lawyer', big: 'Camden Chavez' },
    { house: 'mccarty', name: 'Taylor Bandy', big: 'Gavin Lawyer' },
    { house: 'mccarty', name: 'Tristan Winn', big: null },
    { house: 'mccarty', name: 'Aspen Ames', big: 'Tristan Winn' },
    { house: 'mccarty', name: 'Kenny Maciolek', big: 'Aspen Ames' },
    { house: 'mccarty', name: 'Drew Barth', big: null },
    { house: 'mccarty', name: 'Miles Lambert', big: 'Drew Barth' },
    { house: 'mccarty', name: 'Will Erickson', big: 'Miles Lambert' },
    { house: 'mccarty', name: 'Cruz Rivera', big: null },
    { house: 'mccarty', name: 'Alex Sule', big: 'Cruz Rivera' },
    { house: 'mccarty', name: 'Wade Wright', big: 'Alex Sule' },
    { house: 'mccarty', name: 'Ryan Barrie', big: null },
    { house: 'mccarty', name: 'Ascher Drummet', big: 'Ryan Barrie' },
    { house: 'mccarty', name: 'Daniel Gilmor', big: 'Ryan Barrie', adopted: true },
    { house: 'mccarty', name: 'Dylan Muir', big: 'Daniel Gilmor' },
    { house: 'wilson', name: 'Trevor Sivo', big: null },
    { house: 'wilson', name: 'Max Goldberg', big: 'Trevor Sivo' },
    { house: 'wilson', name: 'Spider Schlopy', big: 'Max Goldberg' },
    { house: 'wilson', name: 'Grant Turley', big: null },
    { house: 'wilson', name: 'Lukas Kennett', big: 'Grant Turley' },
    { house: 'wilson', name: 'Jack Cecil', big: 'Lukas Kennett' },
    { house: 'wilson', name: 'Jacob Neely', big: null },
    { house: 'wilson', name: 'Noah Hermsen', big: 'Jacob Neely' },
    { house: 'wilson', name: 'Reid Klecka', big: 'Noah Hermsen' },
    { house: 'wilson', name: 'Tolan Friesen', big: null },
    { house: 'wilson', name: 'Cody Dickinson', big: 'Tolan Friesen' },
    { house: 'wilson', name: 'Corban Fischbach', big: 'Cody Dickinson' },
    { house: 'wilson', name: 'Owen Ostrom', big: null },
    { house: 'wilson', name: 'Rocco Kuykendall', big: 'Owen Ostrom' },
    { house: 'wilson', name: 'Griffin Sevier', big: 'Rocco Kuykendall' },
    { house: 'wilson', name: 'Corbin Towery', big: null },
    { house: 'wilson', name: 'David Bickerstaff', big: 'Corbin Towery' },
    { house: 'wilson', name: 'Nick Hvatum', big: 'David Bickerstaff' },
    { house: 'wilson', name: 'Cameron Lentz', big: 'Grant Turley', adopted: true },
    { house: 'wilson', name: 'Nate Shuler', big: 'Cameron Lentz' },
    { house: 'elliott', name: 'Kian Lowry', big: null },
    { house: 'elliott', name: 'Nicholas Braver', big: 'Kian Lowry' },
    { house: 'elliott', name: 'Michael Gorelick', big: 'Nicholas Braver' },
    { house: 'elliott', name: 'Brady Richardson', big: 'Kian Lowry', adopted: true },
    { house: 'elliott', name: 'Joey Lennon', big: 'Brady Richardson' },
    { house: 'elliott', name: 'Jaxon Enriquez', big: null },
    { house: 'elliott', name: 'Sage Ames', big: 'Jaxon Enriquez' },
    { house: 'elliott', name: 'Michael Maciolek', big: 'Sage Ames' },
    { house: 'elliott', name: 'Zack Foulon', big: null },
    { house: 'elliott', name: 'Owen Dearborn', big: 'Zack Foulon' },
    { house: 'elliott', name: 'Avery Vihinen', big: ['Owen Dearborn', 'Donnie Marino'] },
    { house: 'elliott', name: 'Nick Ouellette', big: null },
    { house: 'elliott', name: 'Donnie Marino', big: 'Nick Ouellette' },
    { house: 'elliott', name: 'Casey Dittmer', big: null },
    { house: 'elliott', name: 'Garrett Hansen', big: 'Casey Dittmer' },
    { house: 'elliott', name: 'Damon Epstein', big: 'Garrett Hansen', twin: 'Owen Rabinowitz' },
    { house: 'elliott', name: 'Tyler Chobanian', big: 'Casey Dittmer', adopted: true },
    { house: 'elliott', name: 'Reece Fogg', big: 'Tyler Chobanian' },
    { house: 'elliott', name: 'Owen Rabinowitz', big: 'Garrett Hansen', twin: 'Damon Epstein' },
    { house: 'gregg', name: 'Greyson Megard', big: null },
    { house: 'gregg', name: 'Brock Peterson', big: 'Greyson Megard', twin: 'Brian Roberts' },
    { house: 'gregg', name: 'Brian Roberts', big: 'Greyson Megard', twin: 'Brock Peterson' },
    { house: 'gregg', name: 'Cooper Lagsdin', big: null },
    { house: 'gregg', name: 'Jack White', big: 'Cooper Lagsdin' },
    { house: 'gregg', name: 'Reilly Capraro', big: null },
    { house: 'gregg', name: 'Will Michel', big: 'Reilly Capraro' },
    { house: 'gregg', name: 'Kye Sivo', big: 'Will Michel' },
    { house: 'gregg', name: 'Alex Guastella', big: null },
    { house: 'gregg', name: 'Miles Hall', big: 'Alex Guastella' },
    { house: 'gregg', name: 'Evan Eaton', big: 'Miles Hall', adopted: true },
    { house: 'gregg', name: 'Andrew Lotterman', big: 'Evan Eaton' },
    { house: 'gregg', name: 'Tyler Binn', big: 'Alex Guastella', adopted: true },
    { house: 'gregg', name: 'Brady Dobson', big: 'Tyler Binn' },
    { house: 'gregg', name: 'Eli Primosch', big: null },
    { house: 'gregg', name: 'Tyler Hickman', big: null },
    { house: 'gregg', name: 'Will Totten', big: 'Tyler Hickman' },
    { house: 'crofts', name: 'Carson Lolli', big: null },
    { house: 'crofts', name: 'Charlie Skok', big: 'Carson Lolli' },
    { house: 'crofts', name: 'Charlie Keckemet', big: 'Charlie Skok' },
    { house: 'crofts', name: 'Mason Mautino', big: null },
    { house: 'crofts', name: 'Noah Marcus', big: 'Mason Mautino' },
    { house: 'crofts', name: 'Duke Parker', big: 'Noah Marcus' },
    { house: 'crofts', name: 'Zach Tragakis', big: null },
    { house: 'crofts', name: 'Blair Gibson', big: 'Zach Tragakis' },
    { house: 'crofts', name: 'Adam Underhill', big: null },
    { house: 'crofts', name: 'Grady Lynch', big: 'Adam Underhill' },
    { house: 'crofts', name: 'Jacob Weber', big: null },
    { house: 'crofts', name: 'Ian Stubbs', big: 'Jacob Weber' },
    { house: 'crofts', name: 'PJ Stratton', big: 'Ian Stubbs' },
    { house: 'crofts', name: 'Jared Edwards', big: null },
    { house: 'crofts', name: 'Ty Webb', big: 'Jared Edwards' },
    { house: 'crofts', name: 'Jacob Steinberger', big: null },
    { house: 'fletcher', name: 'Brody Zylstra', big: null },
    { house: 'fletcher', name: 'Rohab Shameem', big: 'Brody Zylstra' },
    { house: 'fletcher', name: 'Nico Martin', big: null },
    { house: 'fletcher', name: 'Colton Komar', big: 'Nico Martin' },
    { house: 'fletcher', name: 'Cardin Nguyen', big: 'Colton Komar' },
    { house: 'fletcher', name: 'Bennett Nicastro', big: null },
    { house: 'fletcher', name: 'Jackson Ratner', big: 'Bennett Nicastro' },
    { house: 'fletcher', name: 'Grant Hall', big: null },
    { house: 'fletcher', name: 'Mark Beatty', big: 'Grant Hall' },
    { house: 'fletcher', name: 'Kevin Spoon', big: 'Mark Beatty' },
    { house: 'fletcher', name: 'Jackson Price', big: null },
    { house: 'fletcher', name: 'Tripp Riley', big: 'Jackson Price' },
    { house: 'fletcher', name: 'Jackson Brick', big: 'Tripp Riley' },
    { house: 'fletcher', name: 'Jayden Leithead', big: null },
    { house: 'fletcher', name: 'Owen Bradley', big: 'Jayden Leithead' },
  ];
  var BLURRED = ['Cardin Nguyen'];
  var NICKNAMES = { 'Max Goldberg': 'Goldie', 'Garrett Hansen': 'Gurt', 'Casey Dittmer': 'Ditty', 'Alex Guastella': 'Goose', 'Quincy Guerzon': 'Q', 'Aspen Ames': 'Spen', 'Sage Ames': 'AfroJack', 'Cameron Lentz': 'Cam', 'Zach Tragakis': 'Trag', 'Carson Lolli': 'Lolli', 'Jacob Steinberger': 'Steiny', 'Ian Stubbs': 'Stubs', 'Charlie Keckemet': 'Chuck' };
  var QUOTES = { 'Alex Guastella': 'the backwoods dropped my balls', 'Aspen Ames': "today's gonna be a social experiment", 'Tristan Winn': "It's all a part of my master plan." };

  // ---------- Houses ----------
  var HOUSES = [
    { key: "mccarty", house: "McCarty", founder: "John McCarty", colors: ["#FF2E48", "#FBFBFD"], pattern: "split", band: "pinstripe", accent: "#FF2E48" },
    { key: "wilson", house: "Wilson", founder: "Samuel B. Wilson", colors: ["#050507", "#F5C400"], pattern: "split", band: "checker", accent: "#F5C400" },
    { key: "elliott", house: "Elliott", founder: "James Elliott", colors: ["#FF2E48", "#F5C400"], accent: "#FF2E48" },
    { key: "gregg", house: "Gregg", founder: "Ellis B. Gregg", colors: ["#F5C400", "#4CBB17"], pattern: "split", band: "tartan", accent: "#F5C400" },
    { key: "crofts", house: "Crofts", founder: "Daniel W. Crofts", colors: ["#1F45E0", "#FBFBFD"], pattern: "split", band: "hatch", accent: "#4E77FF" },
    { key: "fletcher", house: "Fletcher", founder: "Naaman Fletcher", colors: ["#C8102E", "#1E6B3A"], pattern: "plaid", accent: "#E0283F" }
  ].map(function (h) {
    var o = Object.assign({}, h, INFO[h.key]);
    o.crest = "assets/img/lineage/crest-" + h.key + ".png";
    o.flag = "assets/img/lineage/flag-" + h.key + ".png";
    return o;
  });
  var HOUSE = {};
  HOUSES.forEach(function (h) { HOUSE[h.key] = h; });

  // House stripes: the original page's patterns, so each house keeps its colors.
  function plaid(r, g, s) {
    return "repeating-linear-gradient(90deg, transparent 0 " + s + "px, rgba(0,0,0,0.45) " + s + "px " + (s + 1) + "px, transparent " + (s + 1) + "px " + (s * 2) + "px, " + r + "cc " + (s * 2) + "px " + (s * 3) + "px), repeating-linear-gradient(0deg, transparent 0 " + s + "px, rgba(0,0,0,0.45) " + s + "px " + (s + 1) + "px, transparent " + (s + 1) + "px " + (s * 2) + "px, " + r + "99 " + (s * 2) + "px " + (s * 3) + "px), " + g;
  }
  function houseFill(h, s) {
    if (!h || !h.colors) return "var(--purple)";
    if (h.band === "checker") return "repeating-conic-gradient(#050507 0 25%, #F5C400 0 50%) 0 0 / " + (s * 3) + "px " + (s * 3) + "px";
    if (h.band === "hatch") return "repeating-linear-gradient(45deg, #1F45E0 0 " + (s * 2.5) + "px, #FBFBFD " + (s * 2.5) + "px " + (s * 3.2) + "px), #1F45E0";
    if (h.band === "pinstripe") return "repeating-linear-gradient(90deg, #FF2E48 0 " + (s * 6) + "px, #FBFBFD " + (s * 6) + "px " + (s * 7) + "px, #FF2E48 " + (s * 7) + "px " + (s * 8) + "px, #FBFBFD " + (s * 8) + "px " + (s * 9) + "px)";
    if (h.band === "tartan") return "repeating-linear-gradient(90deg, #4CBB17 0 " + (s * 3) + "px, #F5C400 " + (s * 3) + "px " + (s * 4) + "px, #4CBB17 " + (s * 4) + "px " + (s * 4.5) + "px, #F5C400 " + (s * 4.5) + "px " + (s * 5.5) + "px, #4CBB17 " + (s * 5.5) + "px " + (s * 6) + "px, #F5C400 " + (s * 6) + "px " + (s * 7) + "px, #4CBB17 " + (s * 7) + "px " + (s * 10) + "px, #050507 " + (s * 10) + "px " + (s * 11) + "px, #4CBB17 " + (s * 11) + "px " + (s * 13) + "px)";
    if (h.pattern === "plaid") return plaid(h.colors[0], h.colors[1], s);
    if (h.pattern === "split") return "linear-gradient(90deg, " + h.colors[0] + " 50%, " + h.colors[1] + " 50%)";
    return "repeating-linear-gradient(-55deg, " + h.colors[0] + " 0 " + (s * 1.7) + "px, " + h.colors[1] + " " + (s * 1.7) + "px " + (s * 3.4) + "px), " + h.colors[0];
  }
  var TRACE = { gregg: { line: "#4CBB17", glow: "#F5C400" }, fletcher: { line: "#2FA05A", glow: "#2FA05A" } };
  function traceColor(key) { return TRACE[key] || { line: HOUSE[key].accent, glow: HOUSE[key].accent }; }

  // ---------- Theme ----------
  var LINE = "rgba(203,176,242,0.42)";
  var GOLD = "#E4C36B";
  function dashBg(h, c, at) {
    var o = -(((at % 11) + 11) % 11);
    return "linear-gradient(" + (h ? "to right" : "to bottom") + ", " + c + " 0 6px, transparent 6px) " + (h ? o + "px 0" : "0 " + o + "px") + " / " + (h ? "11px 100%" : "100% 11px") + " repeat";
  }

  // ---------- Helpers ----------
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function member(nm) { for (var i = 0; i < MEMBERS.length; i++) if (MEMBERS[i].name.toLowerCase() === nm.toLowerCase()) return MEMBERS[i]; return null; }
  function bigsOf(m) { return m && m.big ? [].concat(m.big) : []; }
  function littlesOf(nm) { return MEMBERS.filter(function (x) { return bigsOf(x).indexOf(nm) >= 0; }); }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }
  function lastFirst(n) { var p = n.trim().split(/\s+/); return (p.slice(1).join(" ") + " " + p[0]).toLowerCase(); }
  function quoteOf(n) { return QUOTES[n] ? "“" + QUOTES[n] + "”" : ""; }
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- State ----------
  var S = { view: "house", active: "mccarty", sel: null, nick: false, typeP: null, query: "", hit: 0, zoom: null, groupBy: "class", cq: "", openBro: null, traceN: 0 };

  // Nickname typing: names flip letter by letter, like the original.
  function dn(nm) {
    var nick = NICKNAMES[nm];
    if (!nick) return nm;
    var p = S.typeP, to = S.nick ? nick : nm, from = S.nick ? nm : nick;
    if (p == null) return to;
    if (p < 0.45) return from.slice(0, Math.ceil(from.length * (1 - p / 0.45))) + "▍";
    if (p < 0.55) return "▍";
    return to.slice(0, Math.ceil(to.length * (p - 0.55) / 0.45)) + (p < 1 ? "▍" : "");
  }
  function nm(name) {
    var blur = BLURRED.indexOf(name) >= 0 ? " lg-blur" : "";
    return '<span class="lg-nm' + blur + '" data-nm="' + esc(name) + '">' + esc(dn(name)) + "</span>";
  }
  function retype() {
    $$("[data-nm]").forEach(function (el) { var n = el.getAttribute("data-nm"); if (NICKNAMES[n]) el.textContent = dn(n); });
  }
  function toggleNick() {
    S.nick = !S.nick;
    var btn = $("[data-lg-nick]");
    btn.setAttribute("aria-checked", String(S.nick));
    if (reduced) { S.typeP = null; retype(); return; }
    var t0 = performance.now(), D = 760;
    cancelAnimationFrame(S._typeRaf);
    (function step(now) {
      var p = Math.min(1, (now - t0) / D);
      S.typeP = p < 1 ? p : null; retype();
      if (p < 1) S._typeRaf = requestAnimationFrame(step);
    })(t0);
  }

  // ---------- Tree layout (ported from the original page) ----------
  function layout(houseList, full) {
    var W = full ? 136 : 176, Hn = full ? 44 : 64, GX = full ? 10 : 28, GY = full ? 40 : 72;
    var multi = houseList.length > 1;
    var FH = multi ? 92 : 0, FLAG_H = 78, U = W + GX, GUT = 96, ROWGAP = 120, PER_ROW = multi ? 2 : 1;
    var all = [], founders = [], blocks = [], groupList = [];
    houseList.forEach(function (h) {
      var founder = { name: h.founder, root: true, children: [], bigs: [], house: h.key };
      founders.push(founder);
      var map = {}, groups = {};
      MEMBERS.filter(function (m) { return m.house === h.key; }).forEach(function (m) { map[m.name] = Object.assign({}, m, { bigs: bigsOf(m), children: [] }); });
      var members = Object.keys(map).map(function (k) { return map[k]; });
      members.forEach(function (n) {
        n.bigNodes = n.bigs.map(function (x) { return map[x]; }).filter(Boolean);
        n.twinNode = map[n.twin];
        (n.bigNodes[0] || founder).children.push(n);
        var k = n.bigNodes.length ? n.bigs.join("|") : "__root";
        (groups[k] = groups[k] || { parents: n.bigNodes.length ? n.bigNodes : [founder], kids: [] }).kids.push(n);
        all.push(n);
      });
      var slot = 0, dmax = 0;
      (function place(n, d) {
        n.d = d; n.gen = d; dmax = Math.max(dmax, d);
        if (!n.children.length) n.cx = slot++ * U + W / 2;
        else { n.children.forEach(function (c) { place(c, d + 1); }); n.cx = (n.children[0].cx + n.children[n.children.length - 1].cx) / 2; }
      })(founder, 0);
      function shift(n, dx) { n.cx += dx; n.children.forEach(function (c) { shift(c, dx); }); }
      Object.keys(groups).map(function (k) { return groups[k]; }).filter(function (g) { return g.parents.length > 1; })
        .sort(function (x, y) { return x.kids[0].d - y.kids[0].d; }).forEach(function (g) {
          var dx = g.parents.reduce(function (s, p) { return s + p.cx; }, 0) / g.parents.length - g.kids.reduce(function (s, c) { return s + c.cx; }, 0) / g.kids.length;
          g.kids.forEach(function (c) { shift(c, dx); });
        });
      var nodesH = [founder].concat(members);
      var lo = Math.min.apply(null, nodesH.map(function (n) { return n.cx; })) - W / 2, hi = Math.max.apply(null, nodesH.map(function (n) { return n.cx; })) + W / 2;
      nodesH.forEach(function (n) { n.cx -= lo; });
      blocks.push({ founder: founder, nodes: nodesH, w: hi - lo, depth: dmax });
      Object.keys(groups).forEach(function (k) { groupList.push(groups[k]); });
    });
    var rows = [];
    blocks.forEach(function (b, i) { (rows[Math.floor(i / PER_ROW)] = rows[Math.floor(i / PER_ROW)] || []).push(b); });
    var colW = [0, 0];
    blocks.forEach(function (b, i) { colW[i % PER_ROW] = Math.max(colW[i % PER_ROW], b.w); });
    var totalW = multi ? colW[0] + GUT + colW[1] : colW[0];
    var trunkX = multi ? colW[0] + GUT / 2 : 0;
    var top = multi ? { name: "Phi Gamma Delta", top: true, cx: trunkX, y: 0 } : null;
    var y = multi ? Hn + 64 : 0, rowTops = [];
    rows.forEach(function (r) {
      rowTops.push(y);
      r.forEach(function (b, j) {
        var ox = !multi ? 0 : j === 0 ? colW[0] - b.w : colW[0] + GUT;
        b.nodes.forEach(function (n) { n.ax = n.cx + ox; n.y = y + FH + n.d * (Hn + GY); });
      });
      y += FH + (Math.max.apply(null, r.map(function (b) { return b.depth; })) + 1) * (Hn + GY) - GY + ROWGAP;
    });
    var totalH = y - ROWGAP;
    var lines = [];
    var busYs = rowTops.map(function (t) { return t - 32; });
    if (multi) {
      lines.push({ x: trunkX - 0.5, y: Hn, w: 1, h: busYs[busYs.length - 1] - Hn, bg: LINE });
      rows.forEach(function (r, i) {
        var xs = r.map(function (b) { return b.founder.ax; }).concat([trunkX]);
        var lo = Math.min.apply(null, xs), hi = Math.max.apply(null, xs);
        lines.push({ x: lo, y: busYs[i] - 0.5, w: hi - lo, h: 1, bg: LINE });
        r.forEach(function (b) { lines.push({ x: b.founder.ax - 0.5, y: busYs[i], w: 1, h: rowTops[i] - busYs[i], bg: LINE }); });
      });
    }
    groupList.forEach(function (g) {
      var parents = g.parents, kids = g.kids;
      var py = Math.max.apply(null, parents.map(function (p) { return p.y; })) + Hn, midY = py + GY / 2;
      parents.forEach(function (p) { lines.push({ x: p.ax - 0.5, y: p.y + Hn, w: 1, h: midY - p.y - Hn, bg: LINE }); });
      var solidXs = parents.map(function (p) { return p.ax; }).concat(kids.filter(function (c) { return !c.adopted; }).map(function (c) { return c.ax; }));
      var lo = Math.min.apply(null, solidXs), hi = Math.max.apply(null, solidXs);
      if (hi > lo) lines.push({ x: lo, y: midY - 0.5, w: hi - lo, h: 1, bg: LINE });
      kids.forEach(function (c) {
        if (c.adopted && c.ax > hi) lines.push({ x: hi, y: midY - 0.5, w: c.ax - hi, h: 1, bg: dashBg(1, LINE, hi) });
        if (c.adopted && c.ax < lo) lines.push({ x: c.ax, y: midY - 0.5, w: lo - c.ax, h: 1, bg: dashBg(1, LINE, c.ax) });
        lines.push({ x: c.ax - 0.5, y: midY, w: 1, h: c.y - midY, bg: c.adopted ? dashBg(0, LINE, midY) : LINE });
      });
    });
    all.forEach(function (n) {
      var t = n.twinNode;
      if (t && t.ax > n.ax) lines.push({ x: n.ax + W / 2, y: n.y + Hn / 2 - 1, w: t.ax - n.ax - W, h: 1, bg: GOLD });
    });
    // Animated trace segments per house: trunk → founder → each generation, in order.
    var traces = {}, boxes = [];
    blocks.forEach(function (b, i) {
      var r = Math.floor(i / PER_ROW), by = busYs[r], f = b.founder, segs = [], A = new Map();
      if (multi) {
        segs.push({ x: trunkX - 0.5, y: Hn, w: 1, h: by - Hn, v: 1, o: "top", t: 0, d: 420 });
        segs.push({ x: Math.min(f.ax, trunkX), y: by - 0.5, w: Math.abs(f.ax - trunkX), h: 1, v: 0, o: f.ax < trunkX ? "right" : "left", t: 420, d: 160 });
        segs.push({ x: f.ax - 0.5, y: by, w: 1, h: rowTops[r] - by, v: 1, o: "top", t: 580, d: 120 });
      }
      A.set(f, multi ? 760 : 0);
      groupList.filter(function (g) { return g.parents[0].house === f.house; }).sort(function (x, y) { return x.kids[0].d - y.kids[0].d; }).forEach(function (g) {
        var parents = g.parents, kids = g.kids;
        var t0 = Math.max.apply(null, parents.map(function (p) { return A.get(p) || 0; }));
        var midY = Math.max.apply(null, parents.map(function (p) { return p.y; })) + Hn + GY / 2;
        var gk = kids.map(function (c) { return c.name; });
        parents.forEach(function (p) { segs.push({ x: p.ax - 0.5, y: p.y + Hn, w: 1, h: midY - p.y - Hn, v: 1, o: "top", t: t0, d: 90, pn: p.root ? "__f" : p.name, gk: gk }); });
        var ox = parents.reduce(function (s, p) { return s + p.ax; }, 0) / parents.length;
        var span = Math.max.apply(null, [1].concat(kids.map(function (c) { return Math.abs(c.ax - ox); }), parents.map(function (p) { return Math.abs(p.ax - ox); })));
        parents.forEach(function (p) { var dx = p.ax - ox; if (Math.abs(dx) > 0.5) segs.push({ x: Math.min(p.ax, ox), y: midY - 0.5, w: Math.abs(dx), h: 1, v: 0, o: dx > 0 ? "right" : "left", t: t0 + 30, d: 60, pn: p.root ? "__f" : p.name, gk: gk }); });
        kids.forEach(function (c) {
          var dx = c.ax - ox, hd = Math.abs(dx) > 0.5 ? Math.max(30, 140 * Math.abs(dx) / span) : 0;
          if (hd) segs.push({ x: Math.min(c.ax, ox), y: midY - 0.5, w: Math.abs(dx), h: 1, v: 0, o: dx > 0 ? "left" : "right", t: t0 + 90, d: hd, kn: c.name, dash: !!c.adopted, dh: true });
          segs.push({ x: c.ax - 0.5, y: midY, w: 1, h: c.y - midY, v: 1, o: "top", t: t0 + 90 + hd, d: 90, dash: !!c.adopted, kn: c.name });
          A.set(c, t0 + 90 + hd + 150);
        });
      });
      traces[f.house] = segs;
      var xs = b.nodes.map(function (n) { return n.ax; }), ys = b.nodes.map(function (n) { return n.y; }), PD = 16;
      var x0 = Math.min.apply(null, xs) - W / 2 - PD, x1 = Math.max.apply(null, xs) + W / 2 + PD, y0 = f.y - FH - PD, y1 = Math.max.apply(null, ys) + Hn + PD;
      var end = 0; A.forEach(function (v) { end = Math.max(end, v); });
      boxes.push({ key: f.house, x: x0, y: y0, w: x1 - x0, h: y1 - y0, end: end });
    });
    function role(n) {
      if (n.top) return "Sigma Lambda";
      if (n.root) return "House of";
      var r = n.gen === 1 ? "Patriarch" : n.children.length ? "Big" : "Little";
      return (n.adopted ? (n.gen === 1 ? "Adopted brother" : "Adopted " + r.toLowerCase()) : r) + (n.twin ? " · twin" : "");
    }
    var everyone = (top ? [top] : []).concat(founders, all);
    var nodes = everyone.map(function (n) {
      var ax = n.top ? n.cx : n.ax;
      return {
        x: ax - (n.top ? W / 2 + 36 : W / 2), y: n.y, w: n.top ? W + 72 : W, h: Hn,
        name: n.root ? HOUSE[n.house].house : n.name, kind: n.top ? "top" : n.root ? "root" : "bro",
        id: n.top ? "__top" : n.root ? "root:" + n.house : n.name, house: n.house, gen: n.gen,
        label: role(n), band: n.top ? "var(--purple)" : houseFill(HOUSE[n.house], 2)
      };
    });
    var flags = multi ? founders.map(function (n) { return { house: n.house, x: n.ax - W / 2, y: n.y - FH, w: W, h: FLAG_H }; }) : [];
    return { nodes: nodes, lines: lines, flags: flags, traces: traces, boxes: boxes, w: totalW, h: totalH, full: !!full,
      gens: Math.max.apply(null, blocks.map(function (b) { return b.depth; })), count: all.length };
  }

  // ---------- Selection: path, traces, info card ----------
  function pathFor(selId) {
    var bro = selId && selId.indexOf("root:") !== 0 ? member(selId) : null;
    if (!bro) return null;
    var path = new Set(["__f"]);
    (function up(n) { if (path.has(n)) return; path.add(n); bigsOf(member(n)).forEach(up); })(bro.name);
    (function down(n) { littlesOf(n).forEach(function (x) { if (!path.has(x.name)) { path.add(x.name); down(x.name); } }); })(bro.name);
    return { bro: bro, set: path };
  }
  function depthOf(n) { var m = member(n); return m && m.big ? 1 + depthOf(bigsOf(m)[0]) : 1; }
  function row(label, value, sub) { return value ? { label: label, value: value, sub: sub || "" } : null; }
  function houseInfo(key) {
    var h = HOUSE[key], ms = MEMBERS.filter(function (m) { return m.house === key; });
    var g = Math.max.apply(null, [0].concat(ms.map(function (m) { return depthOf(m.name); })));
    return { kicker: "House", title: esc(h.house), band: houseFill(h, 2), accent: h.accent, rows: [
      row("Clan", esc(h.clan)), row("Motto", "“" + esc(h.motto) + "”", esc(h.mottoEn)), row("Founder", esc(h.founder)),
      row("Brothers", plural(ms.length, "brother", "brothers") + " across " + plural(g, "generation", "generations"))].filter(Boolean) };
  }
  function broInfo(name) {
    var m = member(name) || {}, h = HOUSE[m.house], d = DIRECTORY[name] || {};
    var bigs = bigsOf(m).map(nm).join(" &amp; ") + (m.adopted ? " (adopted)" : "");
    var lits = littlesOf(name).map(function (x) { return nm(x.name); }).join(", ");
    return { kicker: (h ? h.house : "Brother") + (d.standing ? " · " + d.standing : ""), title: nm(name), band: houseFill(h, 2), accent: h ? h.accent : GOLD, rows: [
      row("Major", esc(d.major || "Not listed")), row("Class of", esc(d.year || "Not listed")), row("Big", bigsOf(m).length ? bigs : ""),
      row("Littles", lits), row("Twin", m.twin ? nm(m.twin) : ""), row("Funniest quote", esc(quoteOf(name)))].filter(Boolean) };
  }
  function infoCard(info, cls) {
    return '<div class="lg-info ' + (cls || "") + '" style="--acc:' + info.accent + '"><span class="lg-info-band" style="background:' + info.band + '"></span>' +
      '<div class="lg-info-kicker">' + esc(info.kicker) + '</div><div class="lg-info-title">' + info.title + "</div>" +
      info.rows.map(function (r) { return '<div class="lg-info-row"><span>' + r.label + "</span><strong>" + r.value + "</strong>" + (r.sub ? "<em>" + r.sub + "</em>" : "") + "</div>"; }).join("") + "</div>";
  }

  // ---------- Tree drawing ----------
  function treeHTML(t, opt) {
    var selId = opt.selId, hl = opt.hlHouse, q = opt.q, scale = opt.scale || 1;
    var P = pathFor(selId), path = P && P.set, trHouse = hl || (P && P.bro.house);
    var out = [];
    t.lines.forEach(function (l) { out.push('<i class="lg-ln" style="left:' + l.x + "px;top:" + l.y + "px;width:" + l.w + "px;height:" + l.h + "px;background:" + l.bg + '"></i>'); });
    t.flags.forEach(function (f) {
      var dim = (hl && f.house !== hl) || (path && f.house !== trHouse);
      out.push('<button type="button" class="lg-flag" data-flag="' + f.house + '" style="left:' + f.x + "px;top:" + f.y + "px;width:" + f.w + "px;height:" + f.h + "px;opacity:" + (dim ? 0.28 : 1) + '" aria-label="' + HOUSE[f.house].house + ' house"><img src="' + HOUSE[f.house].flag + '" alt="" loading="lazy"></button>');
    });
    if (hl) {
      var b = t.boxes.filter(function (x) { return x.key === hl; })[0], a = HOUSE[hl].accent;
      out.push('<div class="lg-hbox" style="left:' + b.x + "px;top:" + b.y + "px;width:" + b.w + "px;height:" + b.h + "px;border-color:" + a + ";border-width:" + Math.max(1, 1.5 / scale) + "px;box-shadow:0 0 " + 32 / scale + "px " + a + "55, inset 0 0 " + 32 / scale + "px " + a + "1f;animation-delay:" + b.end + 'ms"></div>');
    }
    t.nodes.forEach(function (n) {
      var hit = q && n.kind !== "top" && n.name.toLowerCase().indexOf(q) >= 0;
      var op = q ? (hit ? 1 : 0.25) : hl && n.kind !== "top" && n.house !== hl ? 0.28 : path && n.kind !== "top" && !(n.kind === "root" ? n.house === trHouse : path.has(n.name)) ? 0.28 : 1;
      var cls = "lg-node lg-node--" + n.kind + (n.gen === 1 ? " is-pat" : "") + (n.id === selId ? " is-sel" : "") + (hit ? " is-hit" : "") + (t.full ? " is-sm" : "");
      var name = n.kind === "bro" ? nm(n.name) : esc(n.name);
      out.push('<button type="button" class="' + cls + '" data-id="' + esc(n.id) + '" style="left:' + n.x + "px;top:" + n.y + "px;width:" + n.w + "px;height:" + n.h + "px;opacity:" + op + '">' +
        '<span class="lg-node-band" style="background:' + n.band + '"></span><span class="lg-node-label">' + esc(n.label) + '</span><span class="lg-node-name">' + name + "</span></button>");
    });
    // Animated trace along the selected brother's line (or the whole selected house).
    var all = trHouse && t.traces[trHouse];
    if (all) {
      var segs = path ? all.filter(function (s) { return s.kn ? path.has(s.kn) : s.pn ? path.has(s.pn) && s.gk.some(function (k) { return path.has(k); }) : true; }) : all;
      var tc = traceColor(trHouse), th = Math.max(1, 2 / scale);
      out.push('<div class="lg-trace">');
      segs.forEach(function (s) {
        var st = "left:" + (s.v ? s.x + 0.5 - th / 2 : s.x) + "px;top:" + (s.v ? s.y : s.y + 0.5 - th / 2) + "px;width:" + (s.v ? th : s.w) + "px;height:" + (s.v ? s.h : th) + "px;" +
          "background:" + (s.dash ? dashBg(s.dh, tc.line, s.dh ? s.x : s.y) : tc.line) + ";" +
          (s.dash ? "filter:drop-shadow(0 0 " + 4 / scale + "px " + tc.glow + ")" : "box-shadow:0 0 " + 6 / scale + "px " + tc.glow + ", 0 0 " + 14 / scale + "px " + tc.glow + "88") + ";" +
          "transform-origin:" + (s.o === "top" ? "50% 0" : s.o === "left" ? "0 50%" : "100% 50%") + ";animation:" + (s.v ? "lgDrawV" : "lgDrawH") + " " + s.d + "ms cubic-bezier(0.45,0,0.55,1) " + s.t + "ms both";
        out.push('<i style="' + st + '"></i>');
      });
      if (P) {
        var sn = t.nodes.filter(function (x) { return x.id === P.bro.name; })[0];
        var arrive = Math.max.apply(null, [0].concat(segs.filter(function (s) { return s.kn === P.bro.name; }).map(function (s) { return s.t + s.d; })));
        if (sn) out.push('<div class="lg-arrive" style="left:' + sn.x + "px;top:" + sn.y + "px;width:" + sn.w + "px;height:" + sn.h + "px;border:" + Math.max(1, 1.5 / scale) + "px solid " + tc.glow +
          ";box-shadow:0 0 " + 10 / scale + "px " + tc.glow + ", 0 0 " + 28 / scale + "px " + tc.glow + ";animation-delay:" + arrive + 'ms"></div>');
      }
      out.push("</div>");
    }
    return out.join("");
  }

  // Place the info card beside a node, inside what's visible of its scroller.
  function placeInfo(scroller, stage, card, nodeEl) {
    var sr = stage.getBoundingClientRect(), vr = scroller.getBoundingClientRect(), nr = nodeEl.getBoundingClientRect();
    var cw = card.offsetWidth, ch = card.offsetHeight, G = 14;
    var vx0 = vr.left - sr.left + 8, vx1 = vr.right - sr.left - 8, vy0 = vr.top - sr.top + 8, vy1 = vr.bottom - sr.top - 8;
    var nx0 = nr.left - sr.left, nx1 = nr.right - sr.left, ny0 = nr.top - sr.top, ny1 = nr.bottom - sr.top;
    var x, y;
    if (vx1 - nx1 - G >= cw) x = nx1 + G;
    else if (nx0 - G - vx0 >= cw) x = nx0 - G - cw;
    else { x = Math.min(Math.max((nx0 + nx1) / 2 - cw / 2, vx0), vx1 - cw); y = ny1 + G; }
    if (y == null) y = Math.min(Math.max((ny0 + ny1) / 2 - ch / 2, vy0), Math.max(vy0, vy1 - ch));
    card.style.left = Math.max(0, x) + "px"; card.style.top = Math.max(0, y) + "px";
  }

  // ---------- By house ----------
  var hostHouses = $("[data-lg-houses]"), hostDetail = $("[data-lg-detail]"), hostHTree = $("[data-lg-htree]");
  var houseTree = null;
  function renderHouses() {
    hostHouses.innerHTML = HOUSES.map(function (h) {
      var n = MEMBERS.filter(function (m) { return m.house === h.key; }).length;
      return '<button type="button" class="lg-house' + (h.key === S.active ? " is-on" : "") + '" data-house="' + h.key + '" aria-pressed="' + (h.key === S.active) + '" style="--acc:' + h.accent + '">' +
        '<img class="lg-house-crest" src="' + h.crest + '" alt="" loading="lazy">' +
        '<span class="lg-house-name"><i style="background:' + houseFill(h, 1) + '"></i>' + esc(h.house) + "</span>" +
        '<span class="lg-house-founder">' + esc(h.founder) + '</span><span class="lg-house-count">' + plural(n, "brother", "brothers") + "</span>" +
        '<span class="lg-house-stripe" style="background:' + houseFill(h, 2) + '"></span></button>';
    }).join("");
  }
  function renderDetail() {
    var h = HOUSE[S.active];
    houseTree = layout([h], false);
    hostDetail.innerHTML =
      '<div class="lg-detail-head"><div><div class="eyebrow">House of</div><h2 class="lg-h2">' + esc(h.house) + '</h2><p class="lg-sub">Line of ' + esc(h.founder) + '</p></div><span class="lg-pill">' + plural(houseTree.gens, "generation", "generations") + "</span></div>" +
      '<div class="lg-detail-card" style="--acc:' + h.accent + '">' +
        '<div class="lg-detail-art"><img src="' + h.crest + '" alt="' + esc(h.house) + ' crest" class="lg-detail-crest"><img src="' + h.flag + '" alt="' + esc(h.house) + ' flag" class="lg-detail-flag"></div>' +
        '<dl class="lg-facts">' +
          '<div><dt>House colors</dt><dd class="lg-swatches">' + h.colors.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") + "</dd></div>" +
          "<div><dt>Clan</dt><dd>" + esc(h.clan) + "</dd></div>" +
          '<div class="lg-fact-wide"><dt>Motto</dt><dd><span class="lg-motto">“' + esc(h.motto) + "”</span><small>" + esc(h.mottoEn) + "</small></dd></div>" +
          "<div><dt>Founder</dt><dd>" + esc(h.founder) + "</dd></div>" +
          "<div><dt>Members</dt><dd>" + plural(houseTree.count, "brother", "brothers") + "</dd></div>" +
          '<div class="lg-fact-wide"><dt>Stripe</dt><dd><span class="lg-stripe" style="background:' + houseFill(h, 4) + '"></span></dd></div>' +
        "</dl></div>";
    renderHouseTree();
  }
  function renderHouseTree() {
    var t = houseTree, avail = hostHTree.clientWidth - 48;
    var s = Math.max(window.innerWidth < 640 ? 0.62 : 0.5, Math.min(1, avail / t.w));
    hostHTree.innerHTML = '<div class="lg-hscroll"><div class="lg-hstage" style="width:' + Math.round(t.w * s) + "px;height:" + Math.round(t.h * s) + 'px">' +
      '<div class="lg-content" style="width:' + t.w + "px;height:" + t.h + "px;transform:scale(" + s + ')">' + treeHTML(t, { selId: S.view === "house" ? S.sel : null, scale: s }) + "</div></div></div>";
    var scroller = $(".lg-hscroll", hostHTree), stage = $(".lg-hstage", hostHTree);
    if (S.sel && S.view === "house") {
      var el = $('[data-id="' + cssEsc(S.sel) + '"]', stage);
      if (el) {
        stage.insertAdjacentHTML("beforeend", infoCard(S.sel.indexOf("root:") === 0 ? houseInfo(S.sel.slice(5)) : broInfo(S.sel), "lg-pop"));
        placeInfo(scroller, stage, $(".lg-pop", stage), el);
      }
    }
  }
  function cssEsc(s) { return window.CSS && CSS.escape ? CSS.escape(s) : s.replace(/"/g, '\\"'); }

  // ---------- Full lineage ----------
  var view = $("[data-lg-view]"), stage = $("[data-lg-stage]"), content = $("[data-lg-content]"), frame = $("[data-lg-frame]");
  var hpanel = $("[data-lg-hpanel]"), qInput = $("[data-lg-q]");
  var fullTree = null, fit = 1, zCur = 1, hlHouse = null;
  function offX(z) { return Math.max(0, (view.clientWidth - 80 - fullTree.w * z) / 2); }
  function computeFit() {
    fit = Math.max(0.1, Math.floor(Math.min(1, (view.clientWidth - 82) / fullTree.w, (view.clientHeight - 82) / fullTree.h) * 100) / 100);
  }
  function applyZoom(z) {
    zCur = z;
    stage.style.width = Math.round(fullTree.w * z + 80) + "px";
    stage.style.height = Math.round(fullTree.h * z + 80) + "px";
    content.style.transform = "translate(" + (offX(z) + 40) + "px, 40px) scale(" + z + ")";
    $("[data-lg-zlabel]").textContent = S.zoom == null ? "Fit" : Math.round(z * 100) + "%";
    var card = $(".lg-pop", stage), el = card && $('[data-id="' + cssEsc(S.sel) + '"]', content);
    if (card && el) placeInfo(view, stage, card, el);
  }
  function renderFull() {
    if (!fullTree) {
      fullTree = layout(HOUSES, true);
      content.style.width = fullTree.w + "px"; content.style.height = fullTree.h + "px";
      $("[data-lg-total]").textContent = MEMBERS.length + " brothers across 6 houses";
      $("[data-lg-chips]").innerHTML = HOUSES.map(function (h) { return '<button type="button" class="lg-chip" data-chip="' + h.key + '" style="--acc:' + h.accent + '"><i style="background:' + houseFill(h, 1) + '"></i>' + esc(h.house) + "</button>"; }).join("");
    }
    computeFit();
    drawFull();
    applyZoom(S.zoom == null ? fit : S.zoom);
  }
  function drawFull() {
    var q = S.query.trim().toLowerCase();
    var z = S.zoom == null ? fit : S.zoom;
    var selId = S.view === "full" && S.sel && S.sel.indexOf("root:") !== 0 ? S.sel : null;
    content.innerHTML = treeHTML(fullTree, { selId: selId, hlHouse: hlHouse, q: q, scale: z });
    var old = $(".lg-pop", stage); if (old) old.remove();
    if (selId) {
      var el = $('[data-id="' + cssEsc(selId) + '"]', content);
      if (el) { stage.insertAdjacentHTML("beforeend", infoCard(broInfo(selId), "lg-pop")); placeInfo(view, stage, $(".lg-pop", stage), el); }
    }
    $$(".lg-chip").forEach(function (c) { c.classList.toggle("is-on", c.getAttribute("data-chip") === hlHouse); });
    if (hlHouse) { hpanel.innerHTML = '<button type="button" class="lg-x" data-lg-close aria-label="Close">×</button>' + infoCard(houseInfo(hlHouse)); hpanel.hidden = false; }
    else hpanel.hidden = true;
    var hits = q ? fullTree.nodes.filter(function (n) { return n.kind !== "top" && n.name.toLowerCase().indexOf(q) >= 0; }).length : 0;
    $("[data-lg-qcount]").textContent = q ? (hits ? plural(hits, "match", "matches") : "No matches") : "";
  }
  function setZoom(z) {
    var old = zCur;
    z = Math.min(2.5, Math.max(0.1, Math.round(z * 100) / 100));
    var cx = (view.scrollLeft + view.clientWidth / 2 - 40 - offX(old)) / old, cy = (view.scrollTop + view.clientHeight / 2 - 40) / old;
    S.zoom = z; applyZoom(z);
    view.scrollLeft = cx * z + 40 + offX(z) - view.clientWidth / 2; view.scrollTop = cy * z + 40 - view.clientHeight / 2;
  }
  // Smooth camera move to (cx, cy) in tree coordinates at zoom z1.
  function animateCam(z1, cx1, cy1, done) {
    cancelAnimationFrame(S._camRaf);
    var z0 = zCur, cx0 = (view.scrollLeft + view.clientWidth / 2 - 40 - offX(z0)) / z0, cy0 = (view.scrollTop + view.clientHeight / 2 - 40) / z0;
    var t0 = performance.now(), D = reduced ? 1 : 900;
    function ease(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
    (function step(now) {
      var p = Math.min(1, (now - t0) / D), k = ease(p), z = z0 + (z1 - z0) * k, cx = cx0 + (cx1 - cx0) * k, cy = cy0 + (cy1 - cy0) * k;
      S.zoom = z; applyZoom(z);
      view.scrollLeft = cx * z + 40 + offX(z) - view.clientWidth / 2; view.scrollTop = cy * z + 40 - view.clientHeight / 2;
      if (p < 1) S._camRaf = requestAnimationFrame(step); else if (done) done();
    })(t0);
  }
  function selectHouse(key) {
    var off = hlHouse === key;
    hlHouse = off ? null : key; S.sel = null;
    drawFull();
    if (off) return camOut();
    var b = fullTree.boxes.filter(function (x) { return x.key === key; })[0];
    var left = b.x + b.w / 2 < fullTree.w / 2, pw = view.clientWidth > 900 ? 330 : 0;
    var z = Math.max(0.1, Math.min(1.1, (view.clientWidth - 82 - pw) / b.w, (view.clientHeight - 82) / b.h));
    animateCam(z, b.x + b.w / 2 + (left ? pw / 2 : -pw / 2) / z, b.y + b.h / 2);
    hpanel.classList.toggle("is-left", !left);
  }
  function camOut() { animateCam(fit, fullTree.w / 2, fullTree.h / 2, function () { S.zoom = null; applyZoom(fit); }); }
  function jumpTo(i) {
    var q = S.query.trim().toLowerCase(); if (!q) return;
    var m = fullTree.nodes.filter(function (n) { return n.kind !== "top" && n.name.toLowerCase().indexOf(q) >= 0; });
    if (!m.length) return;
    var n = m[((i % m.length) + m.length) % m.length], z = zCur;
    view.scrollTo({ left: (n.x + n.w / 2) * z + 40 + offX(z) - view.clientWidth / 2, top: (n.y + n.h / 2) * z + 40 - view.clientHeight / 2, behavior: reduced ? "auto" : "smooth" });
  }
  function toggleFs() {
    if (frame.classList.contains("is-fake-fs")) { frame.classList.remove("is-fake-fs"); document.body.style.overflow = ""; return setTimeout(refit, 30); }
    if (document.fullscreenElement) return void document.exitFullscreen().catch(function () {});
    var req = frame.requestFullscreen || frame.webkitRequestFullscreen;
    function fake() { frame.classList.add("is-fake-fs"); document.body.style.overflow = "hidden"; setTimeout(refit, 30); }
    if (!req || document.fullscreenEnabled === false) return fake();
    try { var p = req.call(frame); if (p && p.catch) p.catch(fake); } catch (e) { fake(); }
  }
  function refit() { if (S.view !== "full" || !fullTree) return; computeFit(); applyZoom(S.zoom == null ? fit : S.zoom); }

  // ---------- By class ----------
  var MODES = [["class", "Class"], ["name", "Name"], ["major", "Major"], ["year", "Year"], ["house", "House"]];
  var YR = ["Freshman", "Sophomore", "Junior", "Senior"];
  function groups() {
    var mode = S.groupBy, everyone = [];
    CLASSES.forEach(function (c) { c.members.forEach(function (n) { if (everyone.indexOf(n) < 0) everyone.push(n); }); });
    function groupBy(keyFn, order, kick) {
      var g = {};
      everyone.forEach(function (n) { [].concat(keyFn(n)).forEach(function (k) { (g[k] = g[k] || []).push(n); }); });
      return Object.keys(g).sort(order).map(function (k) { return { key: mode + ":" + k, name: k, members: g[k], kicker: /^(No house yet|Not listed yet)$/.test(k) ? "Unassigned" : kick }; });
    }
    function last(x) { return x === "No house yet" || x === "Not listed yet" ? 1 : 0; }
    var src = mode === "class" ? CLASSES.map(function (c) { return { key: c.key, name: c.name, kicker: "Pledge class", members: c.members }; })
      : mode === "house" ? groupBy(function (n) { var m = member(n); return m ? HOUSE[m.house].house : "No house yet"; }, function (a, b) { return last(a) - last(b) || HOUSES.findIndex(function (h) { return h.house === a; }) - HOUSES.findIndex(function (h) { return h.house === b; }); }, "House")
      : mode === "year" ? groupBy(function (n) { return DIRECTORY[n] && DIRECTORY[n].standing || "Not listed yet"; }, function (a, b) { return (YR.indexOf(a) < 0 ? 99 : YR.indexOf(a)) - (YR.indexOf(b) < 0 ? 99 : YR.indexOf(b)); }, "Year")
      : mode === "major" ? groupBy(function (n) { return DIRECTORY[n] && DIRECTORY[n].major ? DIRECTORY[n].major.split(",").map(function (s) { return s.trim(); }) : "Not listed yet"; }, function (a, b) { return last(a) - last(b) || a.localeCompare(b); }, "Major")
      : groupBy(function (n) { return lastFirst(n).charAt(0).toUpperCase(); }, function (a, b) { return a.localeCompare(b); }, "Last name");
    var cq = S.cq.trim().toLowerCase();
    if (cq) src = src.map(function (g) { return Object.assign({}, g, { members: g.members.filter(function (n) { return n.toLowerCase().indexOf(cq) >= 0; }) }); }).filter(function (g) { return g.members.length; });
    var hits = cq ? everyone.filter(function (n) { return n.toLowerCase().indexOf(cq) >= 0; }).length : everyone.length;
    return { list: src, hits: hits, total: everyone.length };
  }
  function lineageList(name) {
    var m = member(name), rows = [];
    if (m && m.big) rows.push('<li><span>Big</span>' + bigsOf(m).map(nm).join(" &amp; ") + (m.adopted ? " <small>(adopted)</small>" : "") + "</li>");
    rows.push('<li class="is-self"><span>Brother</span>' + nm(name) + (m && m.twin ? ' <small>twin of ' + nm(m.twin) + "</small>" : "") + "</li>");
    littlesOf(m ? m.name : name).forEach(function (x) {
      rows.push("<li><span>Little</span>" + nm(x.name) + "</li>");
      littlesOf(x.name).forEach(function (y) { rows.push('<li class="is-grand"><span>Grandlittle</span>' + nm(y.name) + "</li>"); });
    });
    return '<ol class="lg-line">' + rows.join("") + "</ol>";
  }
  function renderClass() {
    var mode = S.groupBy, G = groups();
    $("[data-lg-modes]").innerHTML = MODES.map(function (md) { return '<button type="button" role="tab" class="lg-mode" data-mode="' + md[0] + '" aria-selected="' + (md[0] === mode) + '">' + md[1] + "</button>"; }).join("");
    $("[data-lg-gtitle]").textContent = "Members by " + MODES.filter(function (md) { return md[0] === mode; })[0][1].toLowerCase();
    var unit = { class: "classes", name: "letters", major: "majors", year: "years", house: "houses" }[mode];
    $("[data-lg-gtotal]").textContent = S.cq.trim() ? plural(G.hits, "match", "matches") : G.total + " brothers in " + G.list.length + " " + unit;
    if (!G.list.length) { $("[data-lg-cbody]").innerHTML = '<p class="lg-empty">No brothers match that search.</p>'; return; }
    $("[data-lg-cbody]").innerHTML = '<div class="lg-groups">' + G.list.map(function (g) {
      var ms = g.members.slice().sort(function (x, y) { return lastFirst(x).localeCompare(lastFirst(y)); });
      return '<div class="lg-group"><div class="lg-group-head"><div><span class="lg-group-kicker">' + esc(g.kicker) + '</span><h3>' + esc(g.name) + '</h3></div><span class="lg-group-count">' + plural(ms.length, "brother", "brothers") + "</span></div><ul>" +
        ms.map(function (n) {
          var m = member(n), h = m && HOUSE[m.house], d = DIRECTORY[n] || {}, id = g.key + "|" + n, open = S.openBro === id;
          return '<li class="lg-bro' + (open ? " is-open" : "") + '"><button type="button" class="lg-bro-btn" data-bro="' + esc(id) + '" aria-expanded="' + open + '">' +
            '<i style="background:' + (h ? houseFill(h, 1) : "var(--muted-2)") + '"></i><span class="lg-bro-name">' + nm(n) + '</span><span class="lg-bro-house">' + (h ? esc(h.house) : "No house yet") + '</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>' +
            (open ? '<div class="lg-bro-more"><dl><div><dt>Major</dt><dd>' + esc(d.major || "Not listed") + "</dd></div><div><dt>Year</dt><dd>" + esc(d.standing || "Not listed") + "</dd></div><div><dt>Class of</dt><dd>" + esc(d.year || "Not listed") + "</dd></div></dl>" +
              (QUOTES[n] ? '<p class="lg-quote">' + esc(quoteOf(n)) + "</p>" : "") + (m ? lineageList(n) : '<p class="lg-empty">Not placed in a house yet.</p>') + "</div>" : "") + "</li>";
        }).join("") + "</ul></div>";
    }).join("") + "</div>";
  }

  // ---------- Views ----------
  function show(v) {
    S.view = v; S.sel = null;
    $$(".lg-tab").forEach(function (t) { t.setAttribute("aria-selected", String(t.getAttribute("data-view") === v)); });
    $$(".lg-panel").forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== v; });
    if (v === "house") renderHouseTree();
    if (v === "full") renderFull();
    if (v === "class") renderClass();
  }

  // ---------- Events ----------
  $$(".lg-tab").forEach(function (t) { t.addEventListener("click", function () { show(t.getAttribute("data-view")); }); });
  $("[data-lg-nick]").addEventListener("click", toggleNick);
  hostHouses.addEventListener("click", function (e) {
    var b = e.target.closest("[data-house]"); if (!b) return;
    S.active = b.getAttribute("data-house"); S.sel = null; renderHouses(); renderDetail();
  });
  hostHTree.addEventListener("click", function (e) {
    var n = e.target.closest(".lg-node");
    if (e.target.closest(".lg-pop")) return;
    if (!n || n.classList.contains("lg-node--top")) { if (S.sel) { S.sel = null; renderHouseTree(); } return; }
    var id = n.getAttribute("data-id");
    S.sel = S.sel === id ? null : id; renderHouseTree();
  });
  content.addEventListener("click", function (e) {
    e.stopPropagation();
    var f = e.target.closest("[data-flag]"); if (f) return selectHouse(f.getAttribute("data-flag"));
    var n = e.target.closest(".lg-node");
    if (!n || n.classList.contains("lg-node--top")) return clearFullSel();
    if (n.classList.contains("lg-node--root")) return selectHouse(n.getAttribute("data-id").slice(5));
    var id = n.getAttribute("data-id");
    S.sel = S.sel === id ? null : id; drawFull();
  });
  stage.addEventListener("click", function (e) { if (!e.target.closest(".lg-pop") && !e.target.closest(".lg-content")) clearFullSel(); });
  function clearFullSel() { if (S.sel) { S.sel = null; drawFull(); } else if (hlHouse) { hlHouse = null; drawFull(); camOut(); } }
  hpanel.addEventListener("click", function (e) { if (e.target.closest("[data-lg-close]")) { hlHouse = null; drawFull(); camOut(); } });
  $("[data-lg-chips]").addEventListener("click", function (e) { var c = e.target.closest("[data-chip]"); if (c) selectHouse(c.getAttribute("data-chip")); });
  $$("[data-lg-zoom]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-lg-zoom");
      if (k === "in") setZoom(zCur * 1.25); else if (k === "out") setZoom(zCur / 1.25); else { S.zoom = null; applyZoom(fit); }
    });
  });
  view.addEventListener("wheel", function (e) { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(zCur * (e.deltaY < 0 ? 1.1 : 0.9)); } }, { passive: false });
  qInput.addEventListener("input", function () { S.query = qInput.value; S.hit = 0; drawFull(); jumpTo(0); });
  qInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { S.hit += e.shiftKey ? -1 : 1; jumpTo(S.hit); }
    if (e.key === "Escape" && S.query) { e.stopPropagation(); qInput.value = ""; S.query = ""; drawFull(); }
  });
  $("[data-lg-fs]").addEventListener("click", toggleFs);
  document.addEventListener("fullscreenchange", function () { setTimeout(refit, 30); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && frame.classList.contains("is-fake-fs")) toggleFs(); });
  $("[data-lg-modes]").addEventListener("click", function (e) { var b = e.target.closest("[data-mode]"); if (b) { S.groupBy = b.getAttribute("data-mode"); S.openBro = null; renderClass(); } });
  $("[data-lg-cq]").addEventListener("input", function (e) { S.cq = e.target.value; S.openBro = null; renderClass(); });
  $("[data-lg-cbody]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-bro]"); if (!b) return;
    var id = b.getAttribute("data-bro"); S.openBro = S.openBro === id ? null : id; renderClass();
  });
  var rT;
  window.addEventListener("resize", function () {
    clearTimeout(rT);
    rT = setTimeout(function () { if (S.view === "house") renderHouseTree(); else if (S.view === "full") refit(); }, 120);
  });

  // ---------- Start ----------
  var pats = MEMBERS.filter(function (m) { return !m.big; }).length;
  $("[data-lg-stats]").innerHTML = [[MEMBERS.length, "Brothers"], [HOUSES.length, "Houses"], [CLASSES.length, "Pledge classes"], [pats, "Patriarchs"]]
    .map(function (s) { return '<div class="lg-stat"><strong>' + s[0] + "</strong><span>" + s[1] + "</span></div>"; }).join("");
  renderHouses();
  renderDetail();

  // ---------- Intro: black screen, each house's crest and motto, then "Tap to enter" ----------
  var intro = $("[data-sl-intro]"), root = document.documentElement;
  function enter() {
    if (!intro || intro.classList.contains("sl-exit")) return;
    try { sessionStorage.setItem("slIntroSeen", "1"); } catch (e) {}
    intro.classList.add("sl-exit");
    setTimeout(function () { intro.remove(); root.classList.remove("sl-playing"); }, 900);
  }
  if (intro && root.classList.contains("sl-seen")) intro.remove();
  else if (intro) {
    $$("[data-sl-enter]", intro).forEach(function (b) { b.addEventListener("click", enter); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") enter(); });
  }
})();
