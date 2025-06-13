document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const addCharacterBtn = document.getElementById('add-character-btn');
    const charactersContainer = document.getElementById('characters-container');
    let characterIdCounter = 1;

    // Fungsi untuk menambah event listener ke tombol hapus
    const addRemoveListener = (button) => {
        button.addEventListener('click', (e) => {
            e.target.closest('.character-block').remove();
        });
    };

    // Menambah karakter baru
    addCharacterBtn.addEventListener('click', () => {
        characterIdCounter++;
        const newCharacterBlock = charactersContainer.firstElementChild.cloneNode(true);
        newCharacterBlock.dataset.characterId = characterIdCounter;
        
        // Update ID dan label
        newCharacterBlock.querySelector('h3').textContent = `Karakter ${characterIdCounter}`;
        const labels = newCharacterBlock.querySelectorAll('label');
        const textareas = newCharacterBlock.querySelectorAll('textarea');
        
        labels.forEach(label => {
            const oldFor = label.getAttribute('for');
            const newFor = oldFor.replace(/-\d+$/, `-${characterIdCounter}`);
            label.setAttribute('for', newFor);
        });

        textareas.forEach(textarea => {
            const oldId = textarea.id;
            const newId = oldId.replace(/-\d+$/, `-${characterIdCounter}`);
            textarea.id = newId;
            textarea.value = ''; // Kosongkan field
        });

        // Tampilkan tombol hapus
        const removeBtn = newCharacterBlock.querySelector('.remove-character-btn');
        removeBtn.style.display = 'inline-block';
        addRemoveListener(removeBtn);

        charactersContainer.appendChild(newCharacterBlock);
    });

    // Inisialisasi tombol hapus yang mungkin sudah ada (meskipun disembunyikan)
    document.querySelectorAll('.remove-character-btn').forEach(addRemoveListener);

    // Generate prompt
    generateBtn.addEventListener('click', () => {
        // Mengambil nilai umum scene
        const sceneValues = {
            judul: document.getElementById('judul').value,
            latar: document.getElementById('latar').value,
            gerakanKamera: document.getElementById('gerakanKamera').value.split(' (')[0],
            gerakanKameraFull: document.getElementById('gerakanKamera').value,
            pencahayaan: document.getElementById('pencahayaan').value,
            gayaVideo: document.getElementById('gayaVideo').value,
            kualitasVisual: document.getElementById('kualitasVisual').value,
            suasana: document.getElementById('suasana').value,
            suaraLingkungan: document.getElementById('suaraLingkungan').value,
            negativePrompt: document.getElementById('negativePrompt').value,
        };

        // Mengambil nilai dari setiap karakter
        const characters = [];
        document.querySelectorAll('.character-block').forEach((block, index) => {
            const id = block.dataset.characterId;
            const character = {
                id: index + 1,
                deskripsi: document.getElementById(`deskripsiKarakter-${id}`).value,
                suara: document.getElementById(`suaraKarakter-${id}`).value,
                aksi: document.getElementById(`aksiKarakter-${id}`).value,
                ekspresi: document.getElementById(`ekspresiKarakter-${id}`).value,
                dialog: document.getElementById(`dialog-${id}`).value,
            };
            characters.push(character);
        });

        // Membuat dan menampilkan prompt
        document.getElementById('hasilIndonesia').value = generateIndonesianPrompt(sceneValues, characters);
        document.getElementById('hasilInggris').innerHTML = generateEnglishPrompt(sceneValues, characters);
    });

    function generateIndonesianPrompt(scene, characters) {
        let prompt = `**Judul Scene:** ${scene.judul}\n\n`;
        prompt += `**Latar Tempat & Waktu:**\n${scene.latar}\n\n`;
        
        prompt += `**DETAIL KARAKTER:**\n`;
        characters.forEach(char => {
            prompt += `----------------------------------------\n`;
            prompt += `**Karakter ${char.id}:**\n`;
            prompt += `  - Deskripsi: ${char.deskripsi}\n`;
            prompt += `  - Suara: ${char.suara}\n`;
            prompt += `  - Aksi: ${char.aksi}\n`;
            prompt += `  - Ekspresi: ${char.ekspresi}\n`;
            if (char.dialog) {
                prompt += `  - Dialog: ${char.dialog}\n`;
            }
        });
        prompt += `----------------------------------------\n\n`;

        prompt += `**Detail Visual & Suara Tambahan:**\n`;
        prompt += `- Gerakan Kamera: ${scene.gerakanKameraFull}\n`;
        prompt += `- Pencahayaan: ${scene.pencahayaan}\n`;
        prompt += `- Gaya Video/Art Style: ${scene.gayaVideo}\n`;
        prompt += `- Kualitas Visual: ${scene.kualitasVisual}\n\n`;
        prompt += `**Suasana Keseluruhan:** ${scene.suasana}\n\n`;
        prompt += `**Suara Lingkungan/Ambience:**\n${scene.suaraLingkungan}\n\n`;
        prompt += `**Negative Prompt:**\n${scene.negativePrompt}`;
        
        return prompt;
    }

    function generateEnglishPrompt(scene, characters) {
        let finalPrompt = `**Scene Title:** ${scene.judul}. `;
        finalPrompt += `A cinematic, realistic ${scene.kualitasVisual} video. `;
        finalPrompt += `**Setting & Time:** The scene is set at ${scene.latar}. `;

        finalPrompt += `**Character(s) Description:** `;
        characters.forEach((char, index) => {
            finalPrompt += `**Character ${char.id}:** A detailed shot of ${char.deskripsi}. `;
            finalPrompt += `Their voice is consistent, ${char.suara}. `;
            finalPrompt += `The character is ${char.aksi}, showing an expression of ${char.ekspresi}. `;
            if(characters.length > 1 && index < characters.length - 1) {
                finalPrompt += " "; // Separator
            }
        });
        
        finalPrompt += `**Visual Details:** `;
        finalPrompt += `The camera movement is a cinematic ${scene.gerakanKamera}. `;
        finalPrompt += `Lighting: ${scene.pencahayaan}. `;
        finalPrompt += `Art style: ${scene.gayaVideo}. `;
        
        finalPrompt += `**Atmosphere & Sound:** The overall atmosphere is ${scene.suasana}. `;
        finalPrompt += `${scene.suaraLingkungan}. `;
        
        characters.forEach(char => {
            if (char.dialog) {
                finalPrompt += `**Character ${char.id}'s Dialogue:** ${char.dialog}. `;
            }
        });

        finalPrompt += `**Negative Prompt:** Avoid: ${scene.negativePrompt}.`;

        return finalPrompt.replace(/\n/g, '<br>');
    }
}); 