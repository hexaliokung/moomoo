//โครงสร้างข้อมูล: Array of Objects (เมนูอาหาร)

let menuList = [
  "ชุดหมูรวม",
  "ชุดไก่หมักงา",
  "ชุดเนื้อโคขุน",
  "เบคอนสไลด์",
  "ผักรวม",
  "เห็ดเข็มทอง",
  "น้ำจิ้มสูตรเผ็ด",
  "น้ำจิ้มสูตรหวาน",
  "น้ำซุปเติม",
  "โค้ก",
  "เก๊กฮวยเย็น"
];

function addMenu(item) {
  menuList.push(item);
}

function searchMenu(keyword) {
  let result = [];
  for (let i = 0; i < menuList.length; i++) {
    if (menuList[i].includes(keyword)) {  
      result.push(menuList[i]);
    }
  }
  return result; 
}
module.exports = {
  menuList,
  addMenu,
  searchMenu
};

