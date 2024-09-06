document.addEventListener("DOMContentLoaded", function() {
    const next = document.querySelector('.next');
    const prev = document.querySelector('.prev');
    const slide = document.querySelector('.slide');
    const items = document.querySelectorAll('.item');
    let index = 1; // Start from the second item
    
    function moveToNext() {
        slide.appendChild(items[index % items.length]);
        index++;
    }

    function moveToPrev() {
        slide.prepend(items[(index - 2 + items.length) % items.length]);
        index--;
    }

    // Move to the next slide every 3 seconds
    const interval = setInterval(moveToNext, 3000);

    // Adjust controls
    next.addEventListener('click', function() {
        clearInterval(interval); // Stop auto sliding when user clicks next
        moveToNext();
        setInterval(moveToNext, 3000); // Restart auto sliding
    });

    prev.addEventListener('click', function() {
        clearInterval(interval); // Stop auto sliding when user clicks prev
        moveToPrev();
        setInterval(moveToNext, 3000); // Restart auto sliding
    });
});
