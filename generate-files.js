 /* Changes 26.05.27:                 
  * Added Age                         *
  * Added Aliases                     *
  * Added Blocklist                   *
  * Added Int Variables               *
  * Made Mini version                 *
  * Added missing labels              *
  * Added log                         *
  * Added fonts                       *
  * * By: 0m141R1U1h161R1Y1a1d1J1S    */

import fs from 'fs'
import { json } from 'stream/consumers'

let uDataUrl = "https://unicode.org/Public/UNIDATA/";

let blocks = await (await fetch(uDataUrl+"Blocks.txt")).text()
let data = await (await fetch(uDataUrl+"UnicodeData.txt")).text()
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
data=data.split("\n")
data.forEach(a=>{
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

preout.forEach((a,i)=>{
    //if(i<5)
    fs.writeFileSync("./Blocks/"+a.min+"-"+a.max+".json",JSON.stringify(a,undefined,4)
        .replace(/[^\u0000-\u007E]/gu,u=>u.split("").map(_=>"\\u"+_.charCodeAt(0).toString(16).padStart(4,"0")).join("") )
    )
    console.log("✅ Successfully exported block "+a.min+"-"+a.max+".json")
})
// Blocks
fs.writeFileSync("./BlockList.json",JSON.stringify(preout.map(l=>({name:l.name,min:l.min,intMin:l.intMin,max:l.max,intMax:l.intMax,fileName:l.min+"-"+l.max+".json"})),undefined,4))
    console.log("✅ Successfully exported block list")

//i you want the friggling giant json:
fs.writeFileSync("./FullUnicodeRaw.json",JSON.stringify(preout,undefined,4)
    .replace(/[^\u0000-\u007E]/gu,u=>u.split("").map(_=>"\\u"+_.charCodeAt(0).toString(16).padStart(4,"0")).join("") )
)
console.log("✅ Successfully exported the big full json, size: "+(fs.statSync("./FullUnicodeRaw.json").size/1048576).toFixed(2)+"Mb")


fs.writeFileSync("./FullUnicodeRawMini.json",JSON.stringify(preout.map(m=>{
    return {min:m.intMin,max:m.intMax,name:m.name,
        characters : m.characters.map(k=>{
            return {code:k.code,name:k.name,codeInt:k.codeInt,category:k.category,block:k.block.name,data:k.data}
        })
    }
    return mini
}),undefined,4)
    .replace(/[^\u0000-\u007E]/gu,u=>u.split("").map(_=>"\\u"+_.charCodeAt(0).toString(16).padStart(4,"0")).join(""))
)
console.log("✅ Successfully exported the mini full json, size: "+(fs.statSync("./FullUnicodeRawMini.json").size/1048576).toFixed(2)+"Mb")
