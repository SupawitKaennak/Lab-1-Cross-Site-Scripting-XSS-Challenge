// ฟังก์ชันป้องกัน XSS โดยการ escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// แก้ไขช่องโหว่ XSS แล้ว
function displayComments(comments) {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        // ปลอดภัย! ใช้ textContent และ escape HTML
        const escapedName = escapeHtml(comment.name);
        const escapedText = escapeHtml(comment.text);
        commentElement.innerHTML = `<strong>${escapedName}:</strong> ${escapedText}`;
        commentsContainer.appendChild(commentElement);
    });
}

// โหลดคอมเมนต์จาก db.json โดยตรง
async function loadComments() {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
        displayComments(data.comments);
    } catch (error) {
        console.error('Error loading comments:', error);
        // แสดงข้อมูลตัวอย่างถ้าโหลดไม่ได้
        const sampleComments = [
            { name: "Alice", text: "นี่คือคอมเมนต์แรก!" }
        ];
        displayComments(sampleComments);
    }
}

// เพิ่มคอมเมนต์ใหม่ (เก็บใน localStorage แทน)
function addComment(name, text) {
    try {
        // ดึงคอมเมนต์ปัจจุบันจาก localStorage
        let comments = JSON.parse(localStorage.getItem('comments') || '[]');
        
        // เพิ่มคอมเมนต์ใหม่
        const newComment = {
            id: Date.now(),
            name: name,
            text: text
        };
        
        comments.push(newComment);
        
        // บันทึกลง localStorage
        localStorage.setItem('comments', JSON.stringify(comments));
        
        // แสดงคอมเมนต์ใหม่
        displayComments(comments);
        
        // ล้างฟอร์ม
        document.getElementById('name-input').value = '';
        document.getElementById('comment-input').value = '';
        
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

// จัดการ form submission
document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name-input').value.trim();
    const text = document.getElementById('comment-input').value.trim();
    
    if (name && text) {
        addComment(name, text);
    }
});

// โหลดคอมเมนต์เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', function() {
    // ลองโหลดจาก db.json ก่อน ถ้าไม่ได้ให้ใช้ localStorage
    loadComments().then(() => {
        // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
        const localComments = localStorage.getItem('comments');
        if (localComments) {
            displayComments(JSON.parse(localComments));
        }
    });
});