(async()=>{

let udata = {
    __DATA: {},
    __LOADED: false,
}
let unicodejs = {}

let chechLoaded = function(){
    if(!udata.__LOADED){
        console.warn("❌ Database is not loaded! please use method `load(upj)` to load!\n\t* upj: string, URL or Path or Stringified JSON, or empty to generate on fly")
        return true
    }
}

// if(chechLoaded()){return}

unicodejs.load = async function(url_or_path_or_json=""){
    let file = url_or_path_or_json

    if(file.length>1048576){
        try {
            let f = JSON.parse(file)
            udata.__DATA = f
            udata.__LOADED = true
            console.log("✅ Successfully loaded the database from string")
            return true
        } catch(e) {
            throw new Error("❌ Failed to load:\n\t* "+e.message+"\n\t* "+e.stack)
        }
    }
    if(file.startsWith("http")||file.endsWith(".json")){
        let f
        try {
            f = await fetch(file)
            if(f.ok){  
                let f_as_json = await f.json()
                udata.__DATA = f_as_json
                udata.__LOADED = true
                console.log("✅ Successfully loaded the database from url")
                return true
            } else {
                throw new Error("❌ Failed to fetch: HTTP Status "+f.status+"\n\t* TIP: Check https://http.cat/status/"+f.status+" for more info.")
            }
        } catch(e) {
            throw new Error("❌ Failed to load:\n\t* "+e.message+"\n\t* "+e.stack)
        }
    }
    
    if(file==""){
        try {
            console.log("ℹ️ No file or url were provided, generating on fly...")
            console.log("ℹ️ Fetching data from unicode...")

            let uDataUrl = "https://unicode.org/Public/UNIDATA/";

            let blocks = await (await fetch(uDataUrl+"Blocks.txt")).text()
            let _data = await (await fetch(uDataUrl+"UnicodeData.txt")).text()
            let aliases = await (await fetch(uDataUrl+"NameAliases.txt")).text()
            let names = await (await fetch(uDataUrl+"NamesList.txt")).text()
            let ages_pre = await (await fetch(uDataUrl+"DerivedAge.txt")).text()
            let dne = await (await fetch(uDataUrl+"DoNotEmit.txt")).text()
            let ages = {}

            console.log("ℹ️ Fetched data from unicode...")

            dne=dne.split("\n").filter(d=>!!d.match(/^[0-9A-Fa-f]{4,5}/m))

            let related = {
                font_table : [
                    {
                        "standard":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
                        "cursive":"𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒶𝒷𝒸ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏",
                        "old":"𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟",
                        "italic":"𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻"
                    },
                    {
                        "standard":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                        "double":"𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡",
                        "typed":"𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿",
                        "bold":"𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵",
                        "serif":"𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
                        "circle":"ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨",
                    },
                    {
                        "standard":"*",
                        "star":"★"
                    }
                ]
            }

            let uunames = names.match(/^[0-9A-Fa-f]{4,5}.+(\n\t.+)*/gm)

            let final_names = {}
            console.log("🛠️ Building names...")
            uunames.forEach((a,i)=>{
                let code = a.match(/^[0-9A-Fa-f]{4,5}/gm)[0]
                //if(i<10){console.log(a+";\n\n",code)}

                final_names["u"+code] = a
                
            })


            let preout = []

            blocks = blocks.replace(/^#.*$\n/gm,"")

            let columns = [
                "code","name","category",
                "class","bidirectionalCategory",
                "mapping","decimalValue","digitValue",
                "numericValue","mirrored","unicodeName",
                "comment","uppercase","lowercase","titlecase"
            ]

            // thanks https://www.npmjs.com/package/unicode
            console.log("🛠️ Setup blocks")

            blocks=blocks.split("\n").filter(l=>!!l)
            blocks.forEach(a=>{
                let entry = a.split(";")
                preout.push({
                    dataType: "block",
                    min: entry[0].split("..")[0],
                    max: entry[0].split("..")[1],
                    name: entry[1].trimStart(),
                    intMin: parseInt(entry[0].split("..")[0],16),
                    intMax: parseInt(entry[0].split("..")[1],16),
                    characters: []
                })
            })

            console.log("Setup ages")
            ages_pre=ages_pre.split("\n").filter(l=>!!l&&(l[0] != "#"))
            ages_pre.forEach(a=>{
                let splitted = a.split(";")
                let version = splitted[1].replace(/#.+$/m,"").trim()
                let range = splitted[0].trim().split("..").map(r=>parseInt(r,16))

                if(typeof ages[version] == 'undefined'){
                    ages[version] = []
                }
                ages[version].push(range)
            })

            console.log("🛠️ Setup data")
            _data=_data.split("\n")
            _data.forEach(a=>{
                let a_splitted = a.split(";")
                let myCode = parseInt(a_splitted[0],16)
                for(let b in preout){
                        if(myCode >= preout[b].intMin && myCode <= preout[b].intMax){
                        preout[b].characters.push((()=>{
                            let __temp = {}
                            //if(b<10)console.log(a_splitted)
                            for(let i in columns){
                                if(a_splitted[i]){
                                    __temp[columns[i]] = a_splitted[i]
                                }
                            }
                            for(let dn in dne){
                                if(dne[dn].startsWith(__temp.code)){
                                    if(typeof __temp.doNotEmit === 'undefined'){
                                        __temp.doNotEmit = []
                                    }
                                    let em = dne[dn].split("#")[0].split(";").map(_=>_.trim())
                                    __temp.doNotEmit.push({
                                        insteadOf: em[0],
                                        use: em[1],
                                        because: em[2]
                                    })
                                    dne.splice(dn,1)
                                    break
                                }
                            }

                            __temp.char = String.fromCodePoint(parseInt(__temp.code,16))
                            __temp.codeInt = parseInt(__temp.code,16)
                            __temp.block = {
                                name: preout[b].name,
                                range: preout[b].min + ".." + preout[b].max
                            }
                            for(let ag of Object.keys(ages)){
                                for(let _a in ages[ag]){
                                    let a = ages[ag][_a]
                                    if(a.length>1){
                                        if(__temp.codeInt <= a[1] && __temp.codeInt >= a[0]){
                                            __temp.age = ag
                                            if(a[1]==__temp.codeInt){   
                                                ages[ag].splice(_a,1)
                                            }
                                            break
                                        }
                                    } else {
                                        if(__temp.codeInt == a[0]){
                                            __temp.age = ag
                                            ages[ag].splice(_a,1)
                                            break
                                        }
                                    }
                                }
                            }

                            __temp.data = final_names["u"+__temp.code]
                            return __temp
                        })())
                        break
                    }
                }
            })

            console.log("📦 Appending fonts")
            for(let u of related.font_table){
                for(let t of Object.keys(u)){
                    if(t!="standard"){
                        for(let h in [...u[t]]){
                            let i = preout[0].characters.findIndex(o=>o.char==u.standard[h])
                            if(i>0){
                                if(!preout[0].characters[i].fonts){
                                    preout[0].characters[i].fonts=[]
                                } 
                                let c = [...u[t]][h]
                                preout[0].characters[i].fonts.push({
                                    relation:t,glyph:c,glyphCodeInt:c.codePointAt(0),glyphCode:c.codePointAt(0).toString(16).padStart(4,'0')
                                })
                            }
                        }
                    }
                }
            }

            console.log("📦 Appending aliases")
            aliases=aliases.split("\n").filter(l=>!!l&&(l[0] != "#"))
            aliases.forEach(al=>{
                let splitted = al.split(";")
                let al0int = parseInt(splitted[0],16)
                let it = "null"
                for(let p in preout){
                    if(al0int >= preout[p].intMin && al0int <= preout[p].intMax){
                        it = p
                    }
                }
                if(it!="null"){
                    if(preout[it].characters[al0int-preout[it].intMin] && preout[it].characters[al0int-preout[it].intMin].codeInt == al0int){
                        if(!preout[it].characters[al0int-preout[it].intMin].nameAliases){
                            preout[it].characters[al0int-preout[it].intMin].nameAliases=[]
                        } 
                        preout[it].characters[al0int-preout[it].intMin].nameAliases.push({
                            name: splitted[1], type: splitted[2]
                        }) 
                    } else {
                        for(let i in preout[it].characters){
                            if(preout[it].characters[i].codeInt == al0int){

                                if(!preout[it].characters[i].nameAliases){
                                    preout[it].characters[i].nameAliases=[]
                                } 
                                preout[it].characters[i].nameAliases.push({
                                    name: splitted[1], type: splitted[2]
                                })
                                break
                            }
                        }
                    }
                }
            })
            udata.__DATA = preout
            udata.__LOADED = true
            console.log("✅ Successfully generated the database")
            return true
        } catch(e) {
            throw new Error("❌ Failed to load:\n\t* "+e.message+"\n\t* "+e.stack)
        }
    }

/*
    if(file.endsWith(".json")){
        let f
        try {
            f = fs.readFileSync(file,'utf8');
            unicodejs.__DATA = JSON.parse(f)
            console.log("✅ Successfully loaded the database from file")
            return true
        } catch(e) {
            throw new Error("❌ Failed to load:\n\t* "+e.message+"\n\t* "+e.stack)
        }
    }
*/

    console.error("❌ Failed to load: Specified arguments are invalid!")
    return
}

unicodejs.findUDataFromCode = function(code){
    if(chechLoaded()){return}
    for(let block of udata.__DATA){
        if(code >= block.intMin && code <= block.intMax){
            // quick path
            let data = block.characters[(code-block.intMin)]
            if(data && parseInt(data.code,16) == code){
                return data
            } else {
                // painfull path
                for(let char of block.characters){
                    if(char && parseInt(char.code,16) == code){
                        return char
                    }
                }
            }
        }
    }
}

unicodejs.findUDataFromChar = function(char){
    if(chechLoaded()){return}
    return (typeof char == 'string')? unicodejs.findUDataFromCode(char.codePointAt(0)): (console.warn("Invalid arguments!") || {code:"0000",name:"Error!",data:"❌ Invalid arguments!"})
}


unicodejs.findUDataFromChars = function(char){
    if(chechLoaded()||(typeof char != 'string')){return}
    let ret = []
    for(let i of [...char]){
        ret.push(unicodejs.findUDataFromCode(i.codePointAt(0)||0))
    }
    return ret
}
unicodejs.getBlockFromCode = function(code,returnChars=false){
    if(chechLoaded()){return}
    if(isNaN(code)){code=0}
    for(let block of udata.__DATA){
        if(code >= block.intMin && code <= block.intMax){
           if(!returnChars){
                block = {...block}
                block.characters = null
            } 
           return block
        }
    }
}

unicodejs.getBlockFromChar = function(char){
    if(chechLoaded()){return}
    return (typeof char == 'string')? unicodejs.getBlockFromCode(char.codePointAt(0)): (console.warn("Invalid arguments!") || {dataType:"error",name:"error",data:"❌ Invalid arguments!"})
}

window.unicodeDB = unicodejs
})()
