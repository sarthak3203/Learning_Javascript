let itemsContainerElement = document.querySelector('.items-container');
itemsContainerElement.innerHTML=`  <div class="item-container">
                <img class="item-image" src="images/1.jpg" alt="item image">
                <div class="rating">
                    4.5⭐ | 1.4k
                </div>
                <div class="company-name">
                    Carlton London
                </div>
                <div class="item-name">
                    Rhodium Plated CZ floral
                </div>
                <div class="price">
                    <span class="current-price">666</span>
                    <span class="original-price">1099</span>
                    <span class="discount">42% off</span>
                </div>
                <button class="add-to-bag-btn">Add To Bag</button>
            </div>`;