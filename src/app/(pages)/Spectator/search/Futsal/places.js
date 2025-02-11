const places = [
    {
        name: "Better Place Sriracha 1",
        image: "https://itp1.itopfile.com/ImageServer/c196f0ac98e129f7/0/0/%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%8B%E0%B8%AD%E0%B8%A5%E0%B8%A3%E0%B8%A3%E0%B8%9B%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%99%E0%B8%A4%E0%B8%A1%E0%B8%B4%E0%B8%95z-z1246987103006.jpg", // Replace with actual image URL
    },
    {
        name: "Greatness Place Sriracha 1",
        image: "https://itp1.itopfile.com/ImageServer/c196f0ac98e129f7/0/0/%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%8B%E0%B8%AD%E0%B8%A5%E0%B8%A3%E0%B8%A3%E0%B8%9B%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%99%E0%B8%A4%E0%B8%A1%E0%B8%B4%E0%B8%95z-z1246987103006.jpg", // Replace with actual image URL
    },
    {
        name: "The Green Place Sriracha 1",
        image: "https://itp1.itopfile.com/ImageServer/c196f0ac98e129f7/0/0/%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%8B%E0%B8%AD%E0%B8%A5%E0%B8%A3%E0%B8%A3%E0%B8%9B%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%99%E0%B8%A4%E0%B8%A1%E0%B8%B4%E0%B8%95z-z1246987103006.jpg", // Replace with actual image URL
    },
    {
        name: "Better Place Sriracha 2",
        image: "https://itp1.itopfile.com/ImageServer/c196f0ac98e129f7/0/0/%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%8B%E0%B8%AD%E0%B8%A5%E0%B8%A3%E0%B8%A3%E0%B8%9B%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%99%E0%B8%A4%E0%B8%A1%E0%B8%B4%E0%B8%95z-z1246987103006.jpg", // Replace with actual image URL
    },
    {
        name: "Greatness Place Sriracha 2",
        image: "https://itp1.itopfile.com/ImageServer/c196f0ac98e129f7/0/0/%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%8B%E0%B8%AD%E0%B8%A5%E0%B8%A3%E0%B8%A3%E0%B8%9B%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%99%E0%B8%A4%E0%B8%A1%E0%B8%B4%E0%B8%95z-z1246987103006.jpg", // Replace with actual image URL
    },
    {
        name: "The Green Place Sriracha 2",
        image: "https://itp1.itopfile.com/ImageServer/c196f0ac98e129f7/0/0/%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%8B%E0%B8%AD%E0%B8%A5%E0%B8%A3%E0%B8%A3%E0%B8%9B%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%99%E0%B8%A4%E0%B8%A1%E0%B8%B4%E0%B8%95z-z1246987103006.jpg", // Replace with actual image URL
    },
    {
        name: "The Green Place Sriracha 3",
        image: "https://itp1.itopfile.com/ImageServer/c196f0ac98e129f7/0/0/%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%8B%E0%B8%AD%E0%B8%A5%E0%B8%A3%E0%B8%A3%E0%B8%9B%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%99%E0%B8%A4%E0%B8%A1%E0%B8%B4%E0%B8%95z-z1246987103006.jpg", // Replace with actual image URL
    },
    {
        name: "Better Place Sriracha 3",
        image: "https://itp1.itopfile.com/ImageServer/c196f0ac98e129f7/0/0/%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%8B%E0%B8%AD%E0%B8%A5%E0%B8%A3%E0%B8%A3%E0%B8%9B%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%99%E0%B8%A4%E0%B8%A1%E0%B8%B4%E0%B8%95z-z1246987103006.jpg", // Replace with actual image URL
    },
    {
        name: "Greatness Place Sriracha 3",
        image: "https://itp1.itopfile.com/ImageServer/c196f0ac98e129f7/0/0/%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%8B%E0%B8%AD%E0%B8%A5%E0%B8%A3%E0%B8%A3%E0%B8%9B%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%99%E0%B8%A4%E0%B8%A1%E0%B8%B4%E0%B8%95z-z1246987103006.jpg", // Replace with actual image URL
    },
    {
        name: "The Green Place Sriracha 3",
        image: "https://itp1.itopfile.com/ImageServer/c196f0ac98e129f7/0/0/%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%8B%E0%B8%AD%E0%B8%A5%E0%B8%A3%E0%B8%A3%E0%B8%9B%E0%B8%B1%E0%B8%8D%E0%B8%8D%E0%B8%B2%E0%B8%99%E0%B8%A4%E0%B8%A1%E0%B8%B4%E0%B8%95z-z1246987103006.jpg", // Replace with actual image URL
    },
  ];
  
  export default places;