// ALWHAYNETTE FLOWERSHOP

var FACEBOOK_URL = "https://www.facebook.com/alwhaynetteflowers0224";
var STORAGE_FLOWERS = "alwhaynette_selected_flowers";
var STORAGE_ARRANGEMENT = "alwhaynette_arrangement";
var URGENT_FEE = { min: 300, max: 500 };

var flowerPrices = {
    "phalaenopsis": { name: "Phalaenopsis Orchids", min: 80, max: 150, unit: "stem", image: "images/GALLERY EXAMPLES/orkids.jpeg", occasions: "Wedding, Events, Gift", style: "Elegant / Classic" },
    "local-mums": { name: "Chrysanthemums", min: 40, max: 75, unit: "stem", image: "images/GALLERY EXAMPLES/chris.jpeg", occasions: "Sympathy, Events", style: "Classic / Natural" },
    "anthuriums": { name: "Anthuriums", min: 60, max: 120, unit: "stem", image: "images/GALLERY EXAMPLES/anthony.jpg", occasions: "Events, Wedding", style: "Tropical / Elegant" },
    "heliconia": { name: "Heliconias", min: 70, max: 130, unit: "stem", image: "images/GALLERY EXAMPLES/watdaheli.jpg", occasions: "Events, Holiday", style: "Tropical / Cheerful" },
    "roses": { name: "Roses", min: 50, max: 250, unit: "stem", image: "images/GALLERY EXAMPLES/ruses.jpg", occasions: "Romantic, Birthday, Wedding", style: "Romantic / Classic" },
    "tulips": { name: "Tulips", min: 180, max: 280, unit: "stem", image: "images/GALLERY EXAMPLES/hihi.jpg", occasions: "Romantic, Birthday", style: "Romantic / Elegant" },
    "sunflowers": { name: "Sunflowers", min: 120, max: 200, unit: "stem", image: "images/GALLERY EXAMPLES/sonion.jpg", occasions: "Birthday, Everyday Gift", style: "Bright / Cheerful" },
    "lilies": { name: "Lilies", min: 150, max: 300, unit: "stem", image: "images/GALLERY EXAMPLES/lilya.jpeg", occasions: "Sympathy, Wedding, Events", style: "Elegant / Classic" },
    "carnations": { name: "Carnations", min: 45, max: 80, unit: "stem", image: "images/GALLERY EXAMPLES/car.webp", occasions: "Birthday, Wedding, Gift", style: "Classic / Natural" },
    "daisies": { name: "Daisies", min: 35, max: 65, unit: "stem", image: "images/GALLERY EXAMPLES/daysi.jpg", occasions: "Birthday, Everyday Gift", style: "Cheerful / Natural" },
    "aster": { name: "Asters", min: 50, max: 100, unit: "bundle", image: "images/GALLERY EXAMPLES/aster.jpeg", occasions: "Birthday, Events, Wedding", style: "Natural / Cheerful" },
    "statice": { name: "Fillers and Foliage", min: 50, max: 150, unit: "bundle", image: "images/GALLERY EXAMPLES/foli.webp", occasions: "Wedding, Events, Gift", style: "Natural / Classic" }
};

var arrangementFees = {
    "Let the shop choose": { min: 0, max: 0 },
    "Dates": { min: 350, max: 850 },
    "Gifts": { min: 750, max: 1800 },
    "Basket Design": { min: 1200, max: 3000 },
    "Wedding": { min: 2500, max: 15000 },
    "Funeral Flower Services": { min: 6000, max: 10000 },
    "Birthday Bouquets": { min: 800, max: 2500 },
    "Holidays": { min: 900, max: 3500 },
    "Events": { min: 3000, max: 20000 }
};

function formatPeso(amount) {
    return "₱" + Number(amount).toLocaleString("en-PH");
}

function readSavedFlowers() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_FLOWERS) || "{}");
    } catch (error) {
        return {};
    }
}

function saveSelectedFlowers() {
    var selected = {};
    document.querySelectorAll(".flower-checkbox:checked").forEach(function(checkbox) {
        var key = checkbox.value;
        var quantityInput = document.getElementById("quantity-" + key);
        selected[key] = Math.max(1, parseInt(quantityInput.value, 10) || 1);
    });
    localStorage.setItem(STORAGE_FLOWERS, JSON.stringify(selected));
}

function updateFlowerSelectionSummary() {
    var countElement = document.getElementById("selectedFlowerCount");
    var summaryElement = document.getElementById("selectedFlowerSummary");
    if (!countElement || !summaryElement) return;

    var selected = getSelectedFlowers();
    countElement.textContent = selected.length + (selected.length === 1 ? " selected" : " selected");

    if (selected.length === 0) {
        summaryElement.textContent = "No flowers selected yet.";
    } else {
        summaryElement.textContent = selected.map(function(flower) {
            return flower.name + " × " + flower.quantity;
        }).join(" • ");
    }
}

// Build the small image-based flower list in the inquiry form.
function displayFlowers() {
    var container = document.getElementById("flowerPickerPanel");
    if (!container) return;

    container.innerHTML = "";
    var saved = readSavedFlowers();

    Object.keys(flowerPrices).forEach(function(key) {
        var flower = flowerPrices[key];
        var option = document.createElement("div");
        option.className = "flower-option";
        option.id = "option-" + key;

        var image = document.createElement("img");
        image.className = "flower-thumb";
        image.src = flower.image;
        image.alt = flower.name;

        var label = document.createElement("label");
        label.className = "flower-choice";

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "flower-checkbox";
        checkbox.value = key;
        checkbox.checked = Object.prototype.hasOwnProperty.call(saved, key);

        var details = document.createElement("span");
        details.className = "flower-details";

        var name = document.createElement("strong");
        name.textContent = flower.name;

        var price = document.createElement("small");
        price.textContent = formatPeso(flower.min) + " – " + formatPeso(flower.max) + " / " + flower.unit;

        var occasions = document.createElement("small");
        occasions.className = "flower-occasion";
        occasions.textContent = "Best for: " + flower.occasions;

        details.appendChild(name);
        details.appendChild(price);
        details.appendChild(occasions);
        label.appendChild(checkbox);
        label.appendChild(details);

        var quantity = document.createElement("input");
        quantity.type = "number";
        quantity.className = "flower-quantity";
        quantity.id = "quantity-" + key;
        quantity.min = "1";
        quantity.max = "99";
        quantity.step = "1";
        quantity.value = checkbox.checked ? (saved[key] || 1) : 1;
        quantity.disabled = !checkbox.checked;
        quantity.setAttribute("aria-label", flower.name + " quantity");
        quantity.title = "Quantity (1 to 99)";

        option.appendChild(image);
        option.appendChild(label);
        option.appendChild(quantity);
        container.appendChild(option);

        checkbox.addEventListener("change", function() {
            quantity.disabled = !this.checked;
            option.classList.toggle("selected", this.checked);
            saveSelectedFlowers();
            updateFlowerSelectionSummary();
            computeOrderTotal();
        });

        quantity.addEventListener("input", function() {
            if (this.value !== "" && Number(this.value) < 0) {
                alert("Quantity cannot be negative. Please enter a number from 1 to 99.");
                this.value = 1;
            } else if (Number(this.value) > 99) {
                alert("The maximum quantity for each flower is 99.");
                this.value = 99;
            }
            saveSelectedFlowers();
            updateFlowerSelectionSummary();
            computeOrderTotal();
        });

        quantity.addEventListener("change", function() {
            if (this.value === "" || Number(this.value) < 1) {
                alert("Please enter at least 1 stem or bundle.");
                this.value = 1;
            }
            saveSelectedFlowers();
            updateFlowerSelectionSummary();
            computeOrderTotal();
        });

        if (checkbox.checked) option.classList.add("selected");
    });

    updateFlowerSelectionSummary();
}

function getSelectedFlowers() {
    var selected = [];
    document.querySelectorAll(".flower-checkbox:checked").forEach(function(checkbox) {
        var key = checkbox.value;
        var input = document.getElementById("quantity-" + key);
        if (!input || !flowerPrices[key]) return;
        var quantity = Math.max(1, parseInt(input.value, 10) || 1);
        selected.push({
            key: key,
            name: flowerPrices[key].name,
            quantity: quantity,
            unit: flowerPrices[key].unit,
            min: flowerPrices[key].min,
            max: flowerPrices[key].max
        });
    });
    return selected;
}

function computeOrderTotal() {
    var selectedFlowers = getSelectedFlowers();
    var arrangementElement = document.getElementById("arrangement");
    var deliveryElement = document.getElementById("delivery");
    var urgencyElement = document.getElementById("urgency");
    if (!arrangementElement || !deliveryElement) return null;

    var arrangement = arrangementElement.value;
    var delivery = deliveryElement.value;
    var urgent = urgencyElement && urgencyElement.value === "Yes";
    var aFee = arrangementFees[arrangement] || { min: 0, max: 0 };
    var dFee = delivery === "Delivery" ? { min: 80, max: 150 } : { min: 0, max: 0 };
    var rushFee = urgent ? URGENT_FEE : { min: 0, max: 0 };

    var flowerMin = 0;
    var flowerMax = 0;
    var flowerLines = [];
    selectedFlowers.forEach(function(flower) {
        var min = flower.min * flower.quantity;
        var max = flower.max * flower.quantity;
        flowerMin += min;
        flowerMax += max;
        flowerLines.push(flower.name + " (" + flower.quantity + " " + flower.unit + "): " + formatPeso(min) + " – " + formatPeso(max));
    });

    var totalMin = flowerMin + aFee.min + dFee.min + rushFee.min;
    var totalMax = flowerMax + aFee.max + dFee.max + rushFee.max;
    var flowerTotal = "Flowers Total: " + formatPeso(flowerMin) + " – " + formatPeso(flowerMax);
    var arrangementLine = "Arrangement Fee (" + arrangement + "): " + formatPeso(aFee.min) + " – " + formatPeso(aFee.max);
    var deliveryLine = delivery === "Delivery" ? "Delivery Fee (Metro Manila Est.): " + formatPeso(dFee.min) + " – " + formatPeso(dFee.max) : "Store Pick-up Fee: ₱0";
    var urgencyLine = urgent ? "Rush Fee (estimate): " + formatPeso(rushFee.min) + " – " + formatPeso(rushFee.max) : "Rush Fee: ₱0";
    var totalLine = "TOTAL ESTIMATE: " + formatPeso(totalMin) + " – " + formatPeso(totalMax);

    var flowerComputation = document.getElementById("flowerComputation");
    if (flowerComputation) {
        flowerComputation.textContent = selectedFlowers.length ? flowerLines.join("\n") + "\n" + flowerTotal : "No flowers selected";
    }
    var arrangementOutput = document.getElementById("arrangementComputation");
    var deliveryOutput = document.getElementById("deliveryComputation");
    var urgencyOutput = document.getElementById("urgencyComputation");
    var totalOutput = document.getElementById("totalAmount");
    if (arrangementOutput) arrangementOutput.textContent = arrangementLine;
    if (deliveryOutput) deliveryOutput.textContent = deliveryLine;
    if (urgencyOutput) urgencyOutput.textContent = urgencyLine;
    if (totalOutput) totalOutput.textContent = totalLine;

    return {
        flowerLine: flowerLines.join("\n"),
        flowerTotal: flowerTotal,
        arrangementLine: arrangementLine,
        deliveryLine: deliveryLine,
        urgencyLine: urgencyLine,
        totalLine: totalLine
    };
}

// Used by the Add to Inquiry buttons in the gallery.
function selectFlower(flowerKey) {
    if (!flowerPrices[flowerKey]) return;
    var saved = readSavedFlowers();
    if (!saved[flowerKey]) saved[flowerKey] = 1;
    localStorage.setItem(STORAGE_FLOWERS, JSON.stringify(saved));
    window.location.href = "inquiry.html";
}

// Used by the arrangement buttons on the bouquets page.
function selectArrangement(arrangementName) {
    localStorage.setItem(STORAGE_ARRANGEMENT, arrangementName);
    window.location.href = "inquiry.html";
}

function copyAndOpenFacebook() {
    var result = document.getElementById("result");
    if (!result || !result.value.trim()) {
        alert("Please prepare your inquiry first.");
        return;
    }

    // Open Facebook directly from the click so the browser is less likely to block it.
    window.open(FACEBOOK_URL, "_blank", "noopener,noreferrer");

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(result.value).then(function() {
            alert("Your inquiry has been copied. Facebook has also been opened in a new tab.");
        }).catch(function() {
            result.focus();
            result.select();
            document.execCommand("copy");
            alert("Your inquiry has been copied. Facebook has also been opened in a new tab.");
        });
    } else {
        result.focus();
        result.select();
        document.execCommand("copy");
        alert("Your inquiry has been copied. Facebook has also been opened in a new tab.");
    }
}

function toggleAddressField() {
    var delivery = document.getElementById("delivery");
    var addressGroup = document.getElementById("addressGroup");
    var address = document.getElementById("address");
    if (!delivery || !addressGroup || !address) return;
    var isDelivery = delivery.value === "Delivery";
    addressGroup.hidden = !isDelivery;
    address.required = isDelivery;
}

function prepareInquiry() {
    var form = document.getElementById("inquiryForm");
    if (!form || form.dataset.inquiryReady === "true") return;
    form.dataset.inquiryReady = "true";

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        function readValue(id) {
            var field = document.getElementById(id);
            return field ? field.value.trim() : "";
        }

        var name = readValue("customerName");
        var contact = readValue("contact");
        var color = readValue("color");
        var purpose = readValue("purpose");
        var arrangement = readValue("arrangement") || "Let the shop choose";
        var delivery = readValue("delivery") || "Store Pick-up";
        var neededDate = readValue("neededDate");
        var urgency = readValue("urgency") || "No";
        var address = readValue("address");
        var message = readValue("message");
        var selectedFlowers = getSelectedFlowers();

        if (!name || !contact || !color || !purpose || !neededDate) {
            alert("Please complete all required fields marked with an asterisk (*).");
            return;
        }

        if (selectedFlowers.length === 0) {
            alert("Please select at least one flower from the flower list.");
            var pickerButton = document.getElementById("flowerPickerToggle");
            if (pickerButton) pickerButton.focus();
            return;
        }

        if (delivery === "Delivery" && !address) {
            alert("Please enter your delivery address.");
            var addressField = document.getElementById("address");
            if (addressField) addressField.focus();
            return;
        }

        var chosenDate = new Date(neededDate + "T00:00:00");
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(chosenDate.getTime()) || chosenDate < today) {
            alert("Please choose a valid date today or later.");
            var dateField = document.getElementById("neededDate");
            if (dateField) dateField.focus();
            return;
        }

        var quantityInvalid = selectedFlowers.some(function(flower) {
            var input = document.getElementById("quantity-" + flower.key);
            return !input || !input.value || Number(input.value) < 1 || Number(input.value) > 99;
        });

        if (quantityInvalid) {
            alert("Please enter a quantity from 1 to 99 for each selected flower.");
            return;
        }

        var result = document.getElementById("result");
        var resultBox = document.getElementById("resultBox");
        if (!result || !resultBox) {
            alert("The inquiry result area is missing. Please check that the page has an element with id='result' inside id='resultBox'.");
            return;
        }

        var computation = computeOrderTotal();
        if (!computation) {
            alert("The order computation could not be prepared. Please check the arrangement and delivery fields.");
            return;
        }

        var inquiry = "ALWHAYNETTE FLOWERSHOP\nCUSTOMER INQUIRY\n";
        inquiry += "====================================\n\n";
        inquiry += "CUSTOMER INFORMATION\n";
        inquiry += "Name: " + name + "\n";
        inquiry += "Contact: " + contact + "\n";
        inquiry += "Preferred Color: " + color + "\n";
        inquiry += "Purpose / Occasion: " + purpose + "\n\n";
        inquiry += "ORDER DETAILS\n";
        selectedFlowers.forEach(function(flower, index) {
            inquiry += (index + 1) + ". " + flower.name + " - " + flower.quantity + " " + flower.unit + "\n";
        });
        inquiry += "Arrangement: " + arrangement + "\n";
        inquiry += "Needed Date: " + neededDate + "\n";
        inquiry += "Urgent Order: " + urgency + (urgency === "Yes" ? " (estimated extra ₱300 – ₱500)" : "") + "\n";
        inquiry += "Delivery Method: " + delivery + "\n";
        if (delivery === "Delivery") inquiry += "Delivery Address: " + address + "\n";
        inquiry += "\nPRICE COMPUTATION\n====================================\n";
        inquiry += (computation.flowerLine || "No flower line") + "\n";
        inquiry += computation.flowerTotal + "\n";
        inquiry += computation.arrangementLine + "\n";
        inquiry += computation.deliveryLine + "\n";
        inquiry += computation.urgencyLine + "\n\n";
        inquiry += computation.totalLine + "\n";
        inquiry += "====================================\n\n";
        inquiry += "Additional Requests:\n" + (message || "None") + "\n\n";
        inquiry += "Please confirm flower availability and final pricing. Thank you!";

        result.value = inquiry;
        resultBox.style.display = "block";
        resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
    });
}

function setupCharacterLimits() {
    document.querySelectorAll("input[maxlength], textarea[maxlength]").forEach(function(field) {
        field.addEventListener("input", function() {
            var limit = Number(this.getAttribute("maxlength"));
            if (this.value.length > limit) {
                this.value = this.value.slice(0, limit);
                alert("This field has a maximum of " + limit + " characters.");
            }
        });
        field.addEventListener("paste", function(event) {
            var limit = Number(this.getAttribute("maxlength"));
            var pasted = (event.clipboardData || window.clipboardData).getData("text");
            var selectedLength = this.selectionEnd - this.selectionStart;
            if (this.value.length - selectedLength + pasted.length > limit) {
                event.preventDefault();
                alert("This field has a maximum of " + limit + " characters. Please shorten the text before pasting.");
            }
        });
    });
}

function setupFlowerPicker() {
    var toggle = document.getElementById("flowerPickerToggle");
    var panel = document.getElementById("flowerPickerPanel");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", function() {
        var opening = panel.hidden;
        panel.hidden = !opening;
        toggle.setAttribute("aria-expanded", String(opening));
        toggle.querySelector(".picker-arrow").textContent = opening ? "⌃" : "⌄";
    });
}

function setupGalleryFilters() {
    var grid = document.getElementById("galleryGrid");
    if (!grid) return;

    var cards = Array.from(grid.querySelectorAll(".flower-card"));
    var toggle = document.getElementById("flowerFilterToggle");
    var menu = document.getElementById("flowerFilterMenu");
    var summary = document.getElementById("flowerFilterSummary");
    var checkboxes = Array.from(document.querySelectorAll(".flower-filter-checkbox"));
    var minField = document.getElementById("minBudget");
    var maxField = document.getElementById("maxBudget");
    var occasionField = document.getElementById("occasionFilter");
    var styleField = document.getElementById("styleFilter");
    var count = document.getElementById("filterCount");
    var noFlowers = document.getElementById("noFlowers");

    function filterCards() {
        var selectedKeys = checkboxes.filter(function(box) {
            return box.checked;
        }).map(function(box) {
            return box.value;
        });

        var min = minField.value.trim() === "" ? null : Number(minField.value);
        var max = maxField.value.trim() === "" ? null : Number(maxField.value);
        var occasion = occasionField.value;
        var style = styleField.value;
        var shown = 0;

        minField.setCustomValidity(min !== null && (Number.isNaN(min) || min < 0) ? "Enter a minimum price of zero or more." : "");
        maxField.setCustomValidity(max !== null && (Number.isNaN(max) || max < 0) ? "Enter a maximum price of zero or more." : "");

        if (minField.validationMessage || maxField.validationMessage) {
            cards.forEach(function(card) { card.hidden = true; });
            count.textContent = "Please enter a valid price of zero or more.";
            noFlowers.hidden = true;
            return;
        }

        if (min !== null && max !== null && min > max) {
            cards.forEach(function(card) { card.hidden = true; });
            count.textContent = "Minimum budget is higher than maximum budget. Please adjust the range.";
            noFlowers.hidden = true;
            return;
        }

        cards.forEach(function(card) {
            var low = Number(card.dataset.min);
            var high = Number(card.dataset.max);
            var occasions = (card.dataset.occasions || "").split(" ");
            var styles = (card.dataset.styles || "").split(" ");

            
            var matches = (selectedKeys.length === 0 || selectedKeys.includes(card.dataset.key)) &&
                (min === null || low >= min) &&
                (max === null || high <= max) &&
                (occasion === "all" || occasions.includes(occasion)) &&
                (style === "all" || styles.includes(style));


            card.hidden = !matches;
            if (matches) shown++;
        });

        count.textContent = "Showing " + shown + " of " + cards.length + " flowers";
        noFlowers.hidden = shown !== 0;

        if (summary) {
            if (selectedKeys.length === 0) {
                summary.textContent = "All flowers";
            } else if (selectedKeys.length === 1) {
                var selectedLabel = checkboxes.find(function(box) { return box.value === selectedKeys[0]; });
                summary.textContent = selectedLabel ? selectedLabel.parentElement.textContent.trim() : "1 selected";
            } else {
                summary.textContent = selectedKeys.length + " flowers selected";
            }
        }
    }

    if (toggle && menu) {
        toggle.addEventListener("click", function() {
            var opening = menu.hidden;
            menu.hidden = !opening;
            toggle.setAttribute("aria-expanded", String(opening));
            var arrow = toggle.querySelector(".dropdown-arrow");
            if (arrow) arrow.textContent = opening ? "⌃" : "⌄";
        });

        document.addEventListener("click", function(event) {
            if (!event.target.closest(".filter-dropdown")) {
                menu.hidden = true;
                toggle.setAttribute("aria-expanded", "false");
                var arrow = toggle.querySelector(".dropdown-arrow");
                if (arrow) arrow.textContent = "⌄";
            }
        });
    }

    checkboxes.forEach(function(box) {
        box.addEventListener("change", filterCards);
    });

    [minField, maxField].forEach(function(field) {
        field.addEventListener("input", filterCards);
        field.addEventListener("change", filterCards);
    });

    occasionField.addEventListener("change", filterCards);
    styleField.addEventListener("change", filterCards);

    // Let the Clear Filters button reuse the same filtering function.
    window.applyFlowerFilters = filterCards;
    filterCards();
}

function clearFlowerFilters() {
    document.querySelectorAll(".flower-filter-checkbox").forEach(function(box) {
        box.checked = false;
    });

    ["minBudget", "maxBudget"].forEach(function(id) {
        var field = document.getElementById(id);
        if (field) {
            field.value = "";
            field.setCustomValidity("");
        }
    });

    ["occasionFilter", "styleFilter"].forEach(function(id) {
        var field = document.getElementById(id);
        if (field) field.value = "all";
    });

    var menu = document.getElementById("flowerFilterMenu");
    var toggle = document.getElementById("flowerFilterToggle");
    if (menu) menu.hidden = true;
    if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        var arrow = toggle.querySelector(".dropdown-arrow");
        if (arrow) arrow.textContent = "⌄";
    }

    if (typeof window.applyFlowerFilters === "function") {
        window.applyFlowerFilters();
    }
}

// Open a larger gallery when a flower or arrangement card is selected.

function openCardImageGallery(card) {
    var modal = document.getElementById("imageGalleryModal");
    var titleElement = document.getElementById("imageGalleryTitle");
    var imageGrid = document.getElementById("imageGalleryGrid");

    if (!modal || !titleElement || !imageGrid || !card) return;

    var heading = card.dataset.galleryTitle ||
        card.querySelector("h3").textContent;

    titleElement.textContent = heading;
    imageGrid.innerHTML = "";

    var imagePaths = [];
    var mainImage = card.querySelector("img");

    // Use the main flower image first.
    if (mainImage && mainImage.getAttribute("src")) {
        imagePaths.push(mainImage.getAttribute("src"));
    }

    // Add the extra photos from the HTML.
    var extraImages = (card.dataset.galleryImages || "")
        .split("|")
        .map(function(path) {
            return path.trim();
        })
        .filter(Boolean);

    imagePaths = imagePaths.concat(extraImages);

    // Remove duplicate image paths.
    imagePaths = imagePaths.filter(function(path, index) {
        return imagePaths.indexOf(path) === index;
    });

    imagePaths.forEach(function(path) {
        var image = document.createElement("img");

        image.src = path;
        image.alt = heading + " photo";
        image.loading = "eager";

        // Hide images that cannot be found.
        image.onerror = function() {
            this.remove();
        };

        imageGrid.appendChild(image);
    });

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    var closeButton = modal.querySelector(".image-gallery-close");
    if (closeButton) closeButton.focus();
}


function closeCardImageGallery() {
    var modal = document.getElementById("imageGalleryModal");
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function setupImageGalleries() {
    var cards = document.querySelectorAll(".flower-card, .arrangement-card");

    cards.forEach(function(card) {
        var viewButton = card.querySelector("[data-open-gallery]");
        if (viewButton) {
            viewButton.addEventListener("click", function(event) {
                event.stopPropagation();
                openCardImageGallery(card);
            });
        }

        card.addEventListener("click", function(event) {
            if (event.target.closest("button, a, input, select")) return;
            openCardImageGallery(card);
        });
    });

    var modal = document.getElementById("imageGalleryModal");
    if (modal) {
        modal.querySelectorAll("[data-close-gallery]").forEach(function(button) {
            button.addEventListener("click", closeCardImageGallery);
        });
    }

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") closeCardImageGallery();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    displayFlowers();
    setupFlowerPicker();
    setupCharacterLimits();
    setupGalleryFilters();
    setupImageGalleries();

    var arrangement = document.getElementById("arrangement");
    var delivery = document.getElementById("delivery");
    var urgency = document.getElementById("urgency");
    var savedArrangement = localStorage.getItem(STORAGE_ARRANGEMENT);
    if (arrangement && savedArrangement && arrangementFees[savedArrangement]) {
        arrangement.value = savedArrangement;
        localStorage.removeItem(STORAGE_ARRANGEMENT);
    }

    if (arrangement) arrangement.addEventListener("change", computeOrderTotal);
    if (delivery) {
        delivery.addEventListener("change", function() {
            toggleAddressField();
            computeOrderTotal();
        });
        toggleAddressField();
    }
    if (urgency) urgency.addEventListener("change", computeOrderTotal);

    var neededDate = document.getElementById("neededDate");
    if (neededDate) {
        var today = new Date();
        var localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
        neededDate.min = localToday;
    }

    computeOrderTotal();
    prepareInquiry();
});
