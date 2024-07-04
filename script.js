// API URL for fetching product data
const Data_Api = "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json";

// Global variables to store product details
let product_title = "";
let product_color = "";
let product_size = "";

// Thumbnail images, because images are not available in API
const thumbnailImages = [
    {"src":"https://images.unsplash.com/photo-1598626430994-7514b6981e81?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {"src":"https://images.unsplash.com/photo-1608234934850-3bbf5043cf4f?q=80&w=1979&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {"src":"https://images.unsplash.com/photo-1608234807905-4466023792f5?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {"src":"https://images.unsplash.com/photo-1598626431046-c7978e636c14?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
]

// Function to fetch and display product details
const getProductsDetails = async () => {
    try {
        // Fetching data from the API
        const response = await axios.get(Data_Api);
        const productData = response.data.product;

        // Setting vendor name
        const vendor = document.querySelector(".vendor");
        vendor.innerHTML = productData.vendor;

        // Setting product title
        const title = document.querySelector(".title");
        product_title = productData.title;
        title.innerHTML = product_title;

        // Setting product price and calculating discount
        const current_price = document.querySelector(".price");
        const price = productData.price;
        const total_price = document.querySelector(".item-price");
        const compare_at_price = productData.compare_at_price;

        const price_amt = parseFloat(price.replace("$", ""));
        const compare_price_amt = parseFloat(compare_at_price.replace("$", ""));

        current_price.innerHTML = "$" + parseFloat(price_amt).toFixed(2);
        total_price.innerHTML = "$" + parseFloat(compare_price_amt).toFixed(2);

        const percentageDiscount = ((compare_price_amt - price_amt) / compare_price_amt) * 100;
        const discount = document.querySelector(".off");
        const final_dis = percentageDiscount.toFixed(0) + "% Off";
        discount.innerHTML = final_dis;

        // Setting main product image
        const mainImageContainer = document.querySelector(".main-image");
        mainImageContainer.innerHTML = `<img id="imgs" src="https://images.unsplash.com/photo-1598626430994-7514b6981e81?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Main_Image" >`;

        // Setting thumbnail images
        const thumbnailsContainer = document.querySelector(".thumbnail-images");
        thumbnailsContainer.innerHTML = "";  // Clear existing thumbnails
        thumbnailImages.forEach((image, index) => {
            const borderStyle = index === 0 ? "2px solid rgb(73, 73, 177)" : "none";
            thumbnailsContainer.innerHTML += `<img src="${image.src}" alt="Image ${index + 1}" onclick="clk(this)" style="border: ${borderStyle};">`;
        });

        // Setting product description
        const description = document.querySelector(".description");
        description.innerHTML = `<h4 class="description_details">${productData.description}</h4>`;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Calling the function to fetch product details
getProductsDetails();

// Function to change the main image when a thumbnail is clicked
function clk(newImage) {
    const mainImage = document.getElementById("imgs");
    mainImage.src = newImage.src;

    // Update border style of selected thumbnail
    const thumbnails = document.querySelectorAll(".thumbnail-images img");
    thumbnails.forEach((thumbnail) => {
        thumbnail.style.border = "none";
    });
    newImage.style.border = "2px solid rgb(73, 73, 177)";
}

// Variables and function to handle color selection
const colorSelector = document.getElementById('colorSelector');
let selectedColorIndex = null;
let getColor = "";

const getColors = async () => {
    try {
        // Fetching colors data from the API
        const response = await axios.get(Data_Api);
        colors = response.data.product.options[0].values;

        // Creating color labels dynamically
        colors.forEach((color, index) => {
            const colorLabel = document.createElement('div');
            colorLabel.classList.add('color-label');
            colorLabel.style.backgroundColor = Object.values(color)[0];
            colorLabel.addEventListener('click', () => handleColorClick(index));
            colorLabel.addEventListener('transitionend', handleTransitionEnd);

            const tick = document.createElement('div');
            tick.classList.add('selected-tick');
            tick.textContent = '✓';

            const border = document.createElement('div');
            border.classList.add('selected-border');

            colorLabel.appendChild(tick);
            colorLabel.appendChild(border);
            colorSelector.appendChild(colorLabel);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Calling the function to fetch colors
getColors();

// Function to handle color click event
function handleColorClick(index) {
    selectedColorIndex = index;
    updateSelectedColor();
}

// Function to handle transition end event
function handleTransitionEnd(event) {
    if (event.propertyName === 'transform') {
        const colorLabel = event.target;
        colorLabel.classList.remove('clicked');
    }
}

// Function to update selected color display
function updateSelectedColor() {
    const colorLabels = document.querySelectorAll('.color-label');
    colorLabels.forEach((label, index) => {
        if (index === selectedColorIndex) {
            label.classList.add('selected', 'clicked');
        } else {
            label.classList.remove('selected');
        }
    });

    if (selectedColorIndex !== null) {
        const selectedColorKey = Object.keys(colors[selectedColorIndex])[0];
        getColor = selectedColorKey;
        product_color = getColor;
    }
}

// Variables and function to handle size selection
const sizeSelector = document.getElementById('sizeSelector');
let selected_Checkbox = null;

const getSizes = async () => {
    try {
        // Fetching sizes data from the API
        const response = await axios.get(Data_Api);
        const sizes = response.data.product.options[1].values;

        // Creating size labels dynamically
        sizes.forEach((size) => {
            const size_Label = document.createElement('label');
            size_Label.classList.add('size-label');

            const size_Checkbox = document.createElement('input');
            size_Checkbox.type = 'radio';
            size_Checkbox.classList.add('size-checkbox');
            size_Checkbox.value = size;
            size_Checkbox.addEventListener('change', () => handleSizeChange(size_Checkbox));

            const sizeText = document.createTextNode(size);

            size_Label.appendChild(size_Checkbox);
            size_Label.appendChild(sizeText);

            sizeSelector.appendChild(size_Label);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Calling the function to fetch sizes
getSizes();

// Function to handle size change event
function handleSizeChange(checkbox) {
    if (selected_Checkbox && selected_Checkbox !== checkbox) {
        selected_Checkbox.parentElement.classList.remove('selected');
        selected_Checkbox.checked = false;
    }
    selected_Checkbox = checkbox;
    selected_Checkbox.parentElement.classList.add('selected');
    product_size = selected_Checkbox.value;
}

// Variables and functions to handle quantity adjustment
const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');
const valueElement = document.getElementById('value');
let value = 0;

decreaseBtn.addEventListener('click', () => {
    value = Math.max(value - 1, 0);
    updateValue();
});
increaseBtn.addEventListener('click', () => {
    value++;
    updateValue();
});

// Function to update displayed quantity
function updateValue() {
    valueElement.textContent = value;
}

// Function to handle "Add to Cart" button click event
const Add_to_cart = document.querySelector(".addToCart");
Add_to_cart.addEventListener('click', () => {
    const product_saved = document.querySelector(".shopping-saved-products");
    product_saved.innerHTML = '';
    product_saved.innerHTML += `<span class="Info">${product_title} with Color ${product_color} and Size ${product_size} added to the cart</span>`;
});

// Calling the function to fetch product details
getProductsDetails();
