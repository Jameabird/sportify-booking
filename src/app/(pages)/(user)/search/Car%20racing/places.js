const places = [
    {
        name: "Better Place Sriracha 1",
        image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcwL3X9u9nFvIUA0LYi0OFYflEI61cNNCxH-pyk7FcFGyn_YqLNhkZTeuJNbopd5V4uMYBev1u4MfjjX0P-ISz1r209r_YQ7x4elSaL8zJ2hrqIHn_jeTLvy70jmYVt0kkyA70pWFIFjgZwbBsB2mMNXLtY?key=oUUqy3ZDcVEgrGMVw5RrRw", // Replace with actual image URL
    },
    {
        name: "Greatness Place Sriracha 1",
        image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcwL3X9u9nFvIUA0LYi0OFYflEI61cNNCxH-pyk7FcFGyn_YqLNhkZTeuJNbopd5V4uMYBev1u4MfjjX0P-ISz1r209r_YQ7x4elSaL8zJ2hrqIHn_jeTLvy70jmYVt0kkyA70pWFIFjgZwbBsB2mMNXLtY?key=oUUqy3ZDcVEgrGMVw5RrRw", // Replace with actual image URL
    },
    {
        name: "The Green Place Sriracha 1",
        image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcwL3X9u9nFvIUA0LYi0OFYflEI61cNNCxH-pyk7FcFGyn_YqLNhkZTeuJNbopd5V4uMYBev1u4MfjjX0P-ISz1r209r_YQ7x4elSaL8zJ2hrqIHn_jeTLvy70jmYVt0kkyA70pWFIFjgZwbBsB2mMNXLtY?key=oUUqy3ZDcVEgrGMVw5RrRw", // Replace with actual image URL
    },
    {
        name: "Better Place Sriracha 2",
        image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcwL3X9u9nFvIUA0LYi0OFYflEI61cNNCxH-pyk7FcFGyn_YqLNhkZTeuJNbopd5V4uMYBev1u4MfjjX0P-ISz1r209r_YQ7x4elSaL8zJ2hrqIHn_jeTLvy70jmYVt0kkyA70pWFIFjgZwbBsB2mMNXLtY?key=oUUqy3ZDcVEgrGMVw5RrRw", // Replace with actual image URL
    },
    {
        name: "Greatness Place Sriracha 2",
        image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcwL3X9u9nFvIUA0LYi0OFYflEI61cNNCxH-pyk7FcFGyn_YqLNhkZTeuJNbopd5V4uMYBev1u4MfjjX0P-ISz1r209r_YQ7x4elSaL8zJ2hrqIHn_jeTLvy70jmYVt0kkyA70pWFIFjgZwbBsB2mMNXLtY?key=oUUqy3ZDcVEgrGMVw5RrRw", // Replace with actual image URL
    },
    {
        name: "The Green Place Sriracha 2",
        image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcwL3X9u9nFvIUA0LYi0OFYflEI61cNNCxH-pyk7FcFGyn_YqLNhkZTeuJNbopd5V4uMYBev1u4MfjjX0P-ISz1r209r_YQ7x4elSaL8zJ2hrqIHn_jeTLvy70jmYVt0kkyA70pWFIFjgZwbBsB2mMNXLtY?key=oUUqy3ZDcVEgrGMVw5RrRw", // Replace with actual image URL
    },
    {
        name: "The Green Place Sriracha 3",
        image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcwL3X9u9nFvIUA0LYi0OFYflEI61cNNCxH-pyk7FcFGyn_YqLNhkZTeuJNbopd5V4uMYBev1u4MfjjX0P-ISz1r209r_YQ7x4elSaL8zJ2hrqIHn_jeTLvy70jmYVt0kkyA70pWFIFjgZwbBsB2mMNXLtY?key=oUUqy3ZDcVEgrGMVw5RrRw", // Replace with actual image URL
    },
    {
        name: "Better Place Sriracha 3",
        image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcwL3X9u9nFvIUA0LYi0OFYflEI61cNNCxH-pyk7FcFGyn_YqLNhkZTeuJNbopd5V4uMYBev1u4MfjjX0P-ISz1r209r_YQ7x4elSaL8zJ2hrqIHn_jeTLvy70jmYVt0kkyA70pWFIFjgZwbBsB2mMNXLtY?key=oUUqy3ZDcVEgrGMVw5RrRw", // Replace with actual image URL
    },
    {
        name: "Greatness Place Sriracha 3",
        image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcwL3X9u9nFvIUA0LYi0OFYflEI61cNNCxH-pyk7FcFGyn_YqLNhkZTeuJNbopd5V4uMYBev1u4MfjjX0P-ISz1r209r_YQ7x4elSaL8zJ2hrqIHn_jeTLvy70jmYVt0kkyA70pWFIFjgZwbBsB2mMNXLtY?key=oUUqy3ZDcVEgrGMVw5RrRw", // Replace with actual image URL
    },
    {
        name: "The Green Place Sriracha 3",
        image: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcwL3X9u9nFvIUA0LYi0OFYflEI61cNNCxH-pyk7FcFGyn_YqLNhkZTeuJNbopd5V4uMYBev1u4MfjjX0P-ISz1r209r_YQ7x4elSaL8zJ2hrqIHn_jeTLvy70jmYVt0kkyA70pWFIFjgZwbBsB2mMNXLtY?key=oUUqy3ZDcVEgrGMVw5RrRw", // Replace with actual image URL
    },
  ];
  
  export default places;