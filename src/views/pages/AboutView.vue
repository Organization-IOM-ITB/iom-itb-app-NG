<template>
  <div class="bg-white pt-[10px] pb-[32px] px-[18px] md:px-[70px]">
    <h2 class="text-main font-[800] text-[32px] md:text-[50px] leading-tight md:leading-[65.1px] py-[16px] text-center md:text-start">Latar Belakang</h2>
    <div class="flex flex-col md:flex-row justify-between items-center">
      <div class="w-full text-justify">
        <h4 class="text-[24px] md:text-[26px] capitalize text-main font-[700]">Sejarah</h4>
        <p class="font-[500] text-[14px] md:text-[16px] text-main whitespace-pre-line">
        {{ history }}
        </p>
        <h4 class="text-[24px] md:text-[26px] capitalize text-main font-[700]">Fungsi</h4>
        <p class="font-[500] text-[14px] md:text-[16px] text-main whitespace-pre-line">
        {{ functionality }}
        </p>
        <h4 class="text-[24px] md:text-[26px] capitalize text-main font-[700]">Maksud dan Tujuan</h4>
        <p class="font-[500] text-[14px] md:text-[16px] text-main whitespace-pre-line">
        {{ goals }}
        </p>
      </div>
      <img :src="require('@/assets/image/iom-itb.png')" alt="IOM-ITB" class="w-full md:w-1/2 object-cover p-4 md:p-20 hidden md:block">
    </div>
  </div>

  <div class="bg-white pt-[10px] pb-[32px] px-[18px] md:px-[70px]">
    <div class="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-16">
      <!-- Animated Stacking Images -->
      <div class="w-full md:w-1/2 relative h-[400px] md:h-[500px] flex items-center justify-center">
        <div class="relative w-full h-full max-w-[450px]">
          <!-- Image 1: Document -->
          <div 
            :class="[
              'absolute transition-all duration-1000 ease-in-out rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-[90%] h-[90%] top-0 left-0 cursor-zoom-in hover:scale-[1.02]',
              isDocOnTop ? 'z-20 scale-100 translate-x-0 translate-y-0 opacity-100' : 'z-10 scale-90 translate-x-12 translate-y-12 opacity-50'
            ]"
            @click="openPreview(require('@/assets/image/document-iom.png'))"
          >
            <!-- Blurred Backdrop -->
            <img :src="require('@/assets/image/document-iom.png')" class="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110">
            <!-- Clear Foreground -->
            <img :src="require('@/assets/image/document-iom.png')" class="relative w-full h-full object-contain p-2" alt="Dokumen IOM">
          </div>

          <!-- Image 2: Book -->
          <div 
            :class="[
              'absolute transition-all duration-1000 ease-in-out rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-[90%] h-[90%] top-0 left-0 font-bold cursor-zoom-in hover:scale-[1.02]',
              !isDocOnTop ? 'z-20 scale-100 translate-x-0 translate-y-0 opacity-100' : 'z-10 scale-90 translate-x-12 translate-y-12 opacity-50'
            ]"
            @click="openPreview(require('@/assets/image/book-iom.png'))"
          >
            <!-- Blurred Backdrop -->
            <img :src="require('@/assets/image/book-iom.png')" class="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110">
            <!-- Clear Foreground -->
            <img :src="require('@/assets/image/book-iom.png')" class="relative w-full h-full object-contain p-2" alt="Buku Wisuda 1968">
          </div>
        </div>
      </div>

      <div class="w-full md:w-1/2 text-start">
        <h4 class="text-[24px] md:text-[32px] text-main font-[800] mb-6">Eksistensi Sejarah</h4>
        <p class="font-[500] text-[18px] md:text-[22px] text-main leading-relaxed">
          IOM ITB telah disebut di dalam <span class="font-[700] underline decoration-main decoration-4 underline-offset-8">Buku Wisuda ITB tahun 1968</span>.
        </p>
        <p class="mt-4 text-main/80 text-[16px] md:text-[18px] font-[400]">
          Hal ini membuktikan peran serta IOM ITB yang telah berlangsung selama puluhan tahun dalam mendukung perjalanan akademik dan kesejahteraan mahasiswa ITB sejak masa awal.
        </p>
      </div>
    </div>
  </div>

  <div class="border w-[90%] mx-auto opacity-50"></div>

  <div class="bg-white pt-[10px] pb-[32px] px-[18px] md:px-[70px]">
    <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-12 md:gap-16">
      <!-- Text Section -->
      <div class="w-full md:w-1/2 text-start">
        <h4 class="text-[18px] md:text-[22px] text-main font-[600] mb-2">Berdasarkan SK Rektor ITB No. 45/SEK/REK/ITB/70</h4>
        <h3 class="text-[28px] md:text-[40px] text-main font-[800] mb-8">Peresmian IOM ITB</h3>
        
        <div class="bg-[#F2F7FC] p-6 md:p-8 rounded-2xl border border-[#003A6E]/10 mb-8 shadow-sm">
          <h5 class="text-main font-[800] text-[20px] md:text-[24px] mb-6 flex items-center">
            <span class="w-2 h-8 bg-main mr-4 rounded-full"></span>
            PENGURUS IOM-ITB 1970
          </h5>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-main text-[15px] md:text-[17px]">
            <div class="flex flex-col border-b border-main/5 pb-2">
              <span class="text-[12px] uppercase tracking-wider opacity-60">Ketua</span>
              <span class="font-[600]">K. Kridoharsojo</span>
            </div>
            <div class="flex flex-col border-b border-main/5 pb-2">
              <span class="text-[12px] uppercase tracking-wider opacity-60">Ketua I</span>
              <span class="font-[600]">Mayjen Soerjoseojarso</span>
            </div>
            <div class="flex flex-col border-b border-main/5 pb-2">
              <span class="text-[12px] uppercase tracking-wider opacity-60">Ketua II</span>
              <span class="font-[600]">Sumrah S.H</span>
            </div>
            <div class="flex flex-col border-b border-main/5 pb-2">
              <span class="text-[12px] uppercase tracking-wider opacity-60">Sekretaris I</span>
              <span class="font-[600]">Abas Sumintapura</span>
            </div>
            <div class="flex flex-col border-b border-main/5 pb-2">
              <span class="text-[12px] uppercase tracking-wider opacity-60">Sekretaris II</span>
              <span class="italic opacity-40 font-[400]">(tidak terbaca)</span>
            </div>
            <div class="flex flex-col border-b border-main/5 pb-2">
              <span class="text-[12px] uppercase tracking-wider opacity-60">Bendahara I</span>
              <span class="font-[600]">Jusuf Panigoro</span>
            </div>
            <div class="flex flex-col border-b border-main/5 pb-2">
              <span class="text-[12px] uppercase tracking-wider opacity-60">Bendahara II</span>
              <span class="font-[600]">H. M Tahrir.</span>
            </div>
          </div>
        </div>

        <p class="text-main/70 text-[15px] md:text-[18px] italic leading-relaxed pl-6 border-l-4 border-main/20">
          "IOM-ITB sebagai salah satu aparat dewan penyantun ITB, yang tugas wewenangnya sesuai dengan Pasal 13 UU no.22 tahun 1961 tentang Perguruan Tinggi"
        </p>
      </div>

      <!-- Animated Stacking Images Set 2 -->
      <div class="w-full md:w-1/2 relative h-[450px] md:h-[550px] flex items-center justify-center">
        <div class="relative w-full h-full max-w-[450px]">
          <!-- Document 01 -->
          <div 
            :class="[
              'absolute transition-all duration-1000 ease-in-out rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-[90%] h-[95%] top-0 left-0 cursor-zoom-in hover:scale-[1.02]',
              isDoc01OnTop ? 'z-20 scale-100 translate-x-0 translate-y-0 opacity-100' : 'z-10 scale-90 translate-x-12 translate-y-12 opacity-50'
            ]"
            @click="openPreview(require('@/assets/image/document-01.png'))"
          >
            <img :src="require('@/assets/image/document-01.png')" class="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110">
            <img :src="require('@/assets/image/document-01.png')" class="relative w-full h-full object-contain p-4" alt="SK Rektor 1970 Page 1">
          </div>

          <!-- Document 02 -->
          <div 
            :class="[
              'absolute transition-all duration-1000 ease-in-out rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-[90%] h-[95%] top-0 left-0 cursor-zoom-in hover:scale-[1.02]',
              !isDoc01OnTop ? 'z-20 scale-100 translate-x-0 translate-y-0 opacity-100' : 'z-10 scale-90 translate-x-12 translate-y-12 opacity-50'
            ]"
            @click="openPreview(require('@/assets/image/document-02.png'))"
          >
            <img :src="require('@/assets/image/document-02.png')" class="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110">
            <img :src="require('@/assets/image/document-02.png')" class="relative w-full h-full object-contain p-4" alt="SK Rektor 1970 Page 2">
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-white pt-[10px] pb-[32px] px-[18px] md:px-[70px]">
    <div class="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-16">
      <!-- Animated Stacking Images Set 3 (1974) -->
      <div class="w-full md:w-1/2 relative h-[400px] md:h-[500px] flex items-center justify-center">
        <div class="relative w-full h-full max-w-[450px]">
          <div 
            :class="[
              'absolute transition-all duration-1000 ease-in-out rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-[90%] h-[90%] top-0 left-0 cursor-zoom-in hover:scale-[1.02]',
              isDoc03OnTop ? 'z-20 scale-100 translate-x-0 translate-y-0 opacity-100' : 'z-10 scale-90 translate-x-12 translate-y-12 opacity-50'
            ]"
            @click="openPreview(require('@/assets/image/document-03.png'))"
          >
            <img :src="require('@/assets/image/document-03.png')" class="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110">
            <img :src="require('@/assets/image/document-03.png')" class="relative w-full h-full object-contain p-4" alt="SK Pengadilan 1974 Page 1">
          </div>
          <div 
            :class="[
              'absolute transition-all duration-1000 ease-in-out rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-[90%] h-[90%] top-0 left-0 cursor-zoom-in hover:scale-[1.02]',
              !isDoc03OnTop ? 'z-20 scale-100 translate-x-0 translate-y-0 opacity-100' : 'z-10 scale-90 translate-x-12 translate-y-12 opacity-50'
            ]"
            @click="openPreview(require('@/assets/image/document-04.png'))"
          >
            <img :src="require('@/assets/image/document-04.png')" class="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110">
            <img :src="require('@/assets/image/document-04.png')" class="relative w-full h-full object-contain p-4" alt="SK Pengadilan 1974 Page 2">
          </div>
        </div>
      </div>

      <!-- Text Section (1974) -->
      <div class="w-full md:w-1/2 text-start">
        <h4 class="text-[18px] md:text-[22px] text-main font-[600] mb-2">SK Pengadilan Negeri Kelas I - Bandung</h4>
        <h3 class="text-[28px] md:text-[36px] text-main font-[800] mb-4">No. 1/1974/PBH/Bdg</h3>
        <p class="font-[500] text-[18px] md:text-[22px] text-main leading-relaxed mb-6">
          Penetapan IOM ITB sebagai <span class="font-[700] underline decoration-main decoration-4 underline-offset-8">Perkumpulan Indonesia</span> yang berkedudukan di Bandung.
        </p>
        <div class="h-1 w-20 bg-main/20 rounded-full mb-6"></div>
        <p class="text-main/70 text-[16px] md:text-[18px] font-[400] leading-relaxed">
          Pengesahan ini menandai langkah besar IOM ITB sebagai badan hukum resmi yang diakui oleh negara, memperkuat fondasi organisasi dalam menjalankan misi sosialnya.
        </p>
      </div>
    </div>
  </div>

  <div class="border w-[90%] mx-auto opacity-50"></div>

  <div class="bg-white pt-[10px] pb-[32px] px-[18px] md:px-[70px]">
    <div class="flex flex-col-reverse md:flex-row justify-between items-center gap-12 md:gap-16">
      <!-- Text Section (2026) -->
      <div class="w-full md:w-1/2 text-start">
        <h4 class="text-[18px] md:text-[22px] text-main font-[600] mb-2 uppercase tracking-wide">Pembaruan Legalitas 2026</h4>
        <h3 class="text-[28px] md:text-[36px] text-main font-[800] mb-6">SK Menteri Hukum RI</h3>
        
        <div class="bg-[#F2F7FC] p-6 rounded-2xl border-l-8 border-main shadow-md mb-6">
           <p class="text-main font-[700] text-[16px] md:text-[19px] mb-2">Nomor AHU-0003135.AH.01.07.TAHUN 2026</p>
           <p class="text-main/60 text-[14px] md:text-[16px] font-[600]">Tanggal 17 April 2026</p>
        </div>

        <p class="text-main text-[16px] md:text-[20px] leading-relaxed mb-4">
          Tentang <span class="font-[800]">Pengesahan Pendirian Perkumpulan Ikatan Orang Tua Mahasiswa ITB</span>.
        </p>
        <p class="text-main/70 text-[15px] md:text-[17px] leading-relaxed">
          Pembaruan legalitas ini dilakukan untuk memastikan IOM ITB senantiasa mematuhi peraturan perundangan terbaru di Indonesia, menjaga transparansi dan profesionalisme organisasi.
        </p>
      </div>

      <!-- Image Section (2026) -->
      <div class="w-full md:w-1/2 relative h-[450px] md:h-[550px] flex items-center justify-center">
        <div class="relative w-full h-full max-w-[450px]">
          <div 
            class="absolute transition-all duration-1000 ease-in-out rounded-xl shadow-2xl border border-gray-100 overflow-hidden w-[90%] h-[95%] top-0 left-0 bg-white cursor-zoom-in hover:scale-[1.01]"
            @click="openPreview(require('@/assets/image/document-05.png'))"
          >
            <img :src="require('@/assets/image/document-05.png')" class="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110">
            <img :src="require('@/assets/image/document-05.png')" class="relative w-full h-full object-contain p-4" alt="SK Menkumham 2026">
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="border w-[90%] mx-auto opacity-50"></div>

  <div class="bg-white p-[16px] md:p-[24px]">
    <h2 class="text-main font-[800] text-[16px] md:text-[24px] lg:text-[50px] leading-tight md:leading-[65.1px] py-[16px] text-center">Ruang Lingkup Kegiatan IOM-ITB</h2>
    <div class="flex w-full flex-wrap">
     <img :src="require('@/assets/image/lingkup1.png')" class="md:w-1/2" />
     <img :src="require('@/assets/image/lingkup2.png')" class="md:w-1/2" />
    </div>
  </div>

  <div class="bg-white p-[16px]">
    <h2 class="text-main font-[800] text-[16px] md:text-[24px] lg:text-[50px] leading-tight md:leading-[65.1px] py-[16px] text-center">Pembinaan Mahasiswa dan Konseling</h2>
    <div class="flex w-full flex-wrap">
     <img :src="require('@/assets/image/pembinaan1.png')" class="md:w-1/4" />
     <img :src="require('@/assets/image/pembinaan2.png')" class="md:w-1/4" />
     <img :src="require('@/assets/image/pembinaan3.png')" class="md:w-1/4" />
     <img :src="require('@/assets/image/pembinaan4.png')" class="md:w-1/4" />
    </div>
  </div>

  <div class="border w-[90%] mx-auto opacity-50"></div>

  <div class="bg-white p-[16px]">
    <h2 class="text-main font-[800] text-[16px] md:text-[24px] lg:text-[50px] leading-tight md:leading-[65.1px] py-[16px] text-center">Keanggotaan IOM</h2>
    <div class="flex w-full flex-wrap">
     <img :src="require('@/assets/image/keanggotaan.png')" />
    </div>
  </div>

  <div class="bg-white p-[16px]">
    <h2 class="text-main font-[800] text-[16px] md:text-[24px] lg:text-[50px] leading-tight md:leading-[65.1px] py-[16px] text-center">Perangkat Organisasi</h2>
    <div class="flex w-full flex-wrap">
      <img :src="require('@/assets/image/perangkat1.png')" class="md:w-1/4" />
     <img :src="require('@/assets/image/perangkat2.png')" class="md:w-1/4" />
     <img :src="require('@/assets/image/perangkat3.png')" class="md:w-1/4" />
     <img :src="require('@/assets/image/perangkat4.png')" class="md:w-1/4" />
    </div>
  </div>

  <div class="border w-[90%] mx-auto opacity-50"></div>

  <div class="bg-white py-[16px] px-[8px] sm:px-[18px] md:px-[70px]">
    <h2 class="text-main font-[800] text-[16px] md:text-[24px] lg:text-[50px] leading-tight md:leading-[65.1px] py-[16px] text-center">PENGURUS PUSAT HARIAN IKATAN ORANGTUA MAHASISWA - INSTITUT TEKNOLOGI BANDUNG PERIODE 2023 - 2027</h2>
    <div class="flex justify-center items-center">
      <img :src="require('@/assets/image/struktur-organisasi.png')" alt="Struktur Organisasi" class="w-full object-cover p-0 lg:p-20">
    </div>
  </div>

  <div class="bg-colorSecond py-[50px] md:py-[80px] px-[20px] md:px-[70px]">
    <div class="max-w-[1400px] mx-auto">
      <h2 class="text-main font-[800] text-[32px] md:text-[50px] text-center mb-12">Filosofi & Tujuan</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- VISI -->
        <div class="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm border border-main/5">
          <div class="w-16 h-16 bg-main/10 rounded-2xl flex items-center justify-center mb-6 rotate-3">
            <VisiSvg className="w-8 h-8 text-main" />
          </div>
          <h4 class="text-[22px] text-main font-[800] mb-4">Visi</h4>
          <p class="text-[15px] text-main/70 font-[400] leading-relaxed">Bersama ITB, melahirkan anak bangsa yang cerdas, tangguh dan berakhlak mulia.</p>
        </div>

        <!-- MISI -->
        <div class="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm border border-main/5">
          <div class="w-16 h-16 bg-main/10 rounded-2xl flex items-center justify-center mb-6 -rotate-3">
            <MisiSvg className="w-8 h-8 text-main" />
          </div>
          <h4 class="text-[22px] text-main font-[800] mb-4">Misi</h4>
          <p class="text-[15px] text-main/70 font-[400] leading-relaxed">Memotivasi dan membantu mahasiswa ITB untuk mengatasi kendala dalam studinya serta berperan aktif dalam pembinaan watak, kepedulian sosial dan budaya.</p>
        </div>

        <!-- MAKSUD & TUJUAN -->
        <div class="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm border border-main/5">
          <div class="w-16 h-16 bg-main/10 rounded-2xl flex items-center justify-center mb-6 rotate-6">
            <TujuanSvg className="w-8 h-8 text-main" />
          </div>
          <h4 class="text-[22px] text-main font-[800] mb-4">Maksud & Tujuan</h4>
          <p class="text-[15px] text-main/70 font-[400] leading-relaxed">Ikut serta membina mahasiswa, dengan menjalin hubungan antar sesama orang tua mahasiswa, menghimpun dan menyalurkan daya dan usaha.</p>
        </div>

        <!-- FUNGSI -->
        <div class="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm border border-main/5">
          <div class="w-16 h-16 bg-main/10 rounded-2xl flex items-center justify-center mb-6 -rotate-6">
            <FungsiSvg className="w-8 h-8 text-main" />
          </div>
          <h4 class="text-[22px] text-main font-[800] mb-4">Fungsi</h4>
          <p class="text-[15px] text-main/70 font-[400] leading-relaxed">Sebagai mitra ITB, khususnya dalam pembinaan kelangsungan pendidikan yang bersifat sosial dan kekeluargaan.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Sinergi Diagram Section -->
  <div class="bg-white py-[50px] md:py-[80px] px-[18px] md:px-[70px]">
    <div class="max-w-[1200px] mx-auto text-center">
      <h2 class="text-main font-[800] text-[32px] md:text-[50px] mb-6">Model Sinergi Organisasi</h2>
      <p class="text-main/60 text-[18px] mb-12 max-w-[800px] mx-auto">IOM-ITB menghubungkan institusi, orang tua, dan mahasiswa dalam satu ekosistem pendukung yang berkelanjutan.</p>
      <div class="relative group cursor-zoom-in" @click="openPreview(require('@/assets/image/diagram.png'))">
        <img :src="require('@/assets/image/diagram.png')" alt="Diagram Sinergi" class="w-full max-w-[900px] mx-auto rounded-2xl shadow-xl border border-gray-100 transition-transform duration-500 group-hover:scale-[1.01]">
        <div class="absolute inset-0 bg-main/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
          <span class="bg-white/90 px-6 py-3 rounded-full text-main font-bold shadow-lg flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
            Klik untuk Perbesar
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Program Unggulan Section -->
  <div class="bg-colorSecond py-[50px] md:py-[80px] px-[18px] md:px-[70px]">
    <div class="max-w-[1400px] mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-main font-[800] text-[32px] md:text-[50px] mb-4">Program & Layanan Utama</h2>
        <div class="h-1.5 w-32 bg-main mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- BANKES -->
        <div class="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-main">
          <div class="text-main font-[900] text-6xl opacity-10 mb-[-40px]">01</div>
          <h3 class="text-[26px] text-main font-[800] mb-6">BANKES</h3>
          <p class="text-main/60 text-[14px] font-[600] mb-6 uppercase tracking-widest">Bantuan Mahasiswa & Kesehatan</p>
          <ul class="space-y-4">
            <li class="flex items-start gap-3 text-main/80"><span class="w-2 h-2 bg-main rounded-full mt-2 shrink-0"></span> Bantuan UKT & Biaya Hidup</li>
            <li class="flex items-start gap-3 text-main/80"><span class="w-2 h-2 bg-main rounded-full mt-2 shrink-0"></span> Bantuan Tugas Akhir</li>
            <li class="flex items-start gap-3 text-main/80"><span class="w-2 h-2 bg-main rounded-full mt-2 shrink-0"></span> Bantuan Kesehatan & Kondisi Darurat</li>
            <li class="flex items-start gap-3 text-main/80"><span class="w-2 h-2 bg-main rounded-full mt-2 shrink-0"></span> Bantuan Laptop & Non-Kesehatan</li>
          </ul>
        </div>

        <!-- PMK -->
        <div class="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-main">
          <div class="text-main font-[900] text-6xl opacity-10 mb-[-40px]">02</div>
          <h3 class="text-[26px] text-main font-[800] mb-6">PMK</h3>
          <p class="text-main/60 text-[14px] font-[600] mb-6 uppercase tracking-widest">Pembinaan Mahasiswa & Konseling</p>
          <ul class="space-y-4">
            <li class="flex items-start gap-3 text-main/80"><span class="w-2 h-2 bg-main rounded-full mt-2 shrink-0"></span> Dukungan Kegiatan Mahasiswa</li>
            <li class="flex items-start gap-3 text-main/80"><span class="w-2 h-2 bg-main rounded-full mt-2 shrink-0"></span> Karakter & Kesehatan Mental</li>
            <li class="flex items-start gap-3 text-main/80"><span class="w-2 h-2 bg-main rounded-full mt-2 shrink-0"></span> Kepedulian Sosial & Lingkungan</li>
            <li class="flex items-start gap-3 text-main/80"><span class="w-2 h-2 bg-main rounded-full mt-2 shrink-0"></span> Persiapan Pasca Studi / Dunia Kerja</li>
          </ul>
        </div>

        <!-- OKI -->
        <div class="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-main">
          <div class="text-main font-[900] text-6xl opacity-10 mb-[-40px]">03</div>
          <h3 class="text-[26px] text-main font-[800] mb-6">OKI</h3>
          <p class="text-main/60 text-[14px] font-[600] mb-6 uppercase tracking-widest">Organisasi, Komunikasi & Informasi</p>
          <ul class="space-y-4 text-justify">
            <li class="flex items-start gap-3 text-main/80"><span class="w-2 h-2 bg-main rounded-full mt-2 shrink-0"></span> Cabang IOM Kota/Kabupaten/Provinsi</li>
            <li class="flex items-start gap-3 text-main/80"><span class="w-2 h-2 bg-main rounded-full mt-2 shrink-0"></span> PJ IOM Fakultas/Sekolah per Angkatan</li>
            <li class="flex items-start gap-3 text-main/80"><span class="w-2 h-2 bg-main rounded-full mt-2 shrink-0"></span> Pengelolaan Website & Media Sosial</li>
            <li class="flex items-start gap-3 text-main/80"><span class="w-2 h-2 bg-main rounded-full mt-2 shrink-0"></span> Pengembangan Sistem Informasi Organisasi</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <!-- Image Preview Modal -->
  <Transition name="fade">
    <div v-if="isPreviewOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-12 shadow-inner" @click="closePreview">
      <button class="absolute top-6 right-6 text-white text-5xl hover:text-gray-300 transition-colors z-[110] leading-none font-light" @click="closePreview">&times;</button>
      <div class="relative w-full h-full flex items-center justify-center" @click.stop>
        <img :src="previewImage" class="max-w-full max-h-full object-contain shadow-2xl rounded-sm border border-white/10" alt="Preview">
      </div>
    </div>
  </Transition>
</template>

<script>
import HeaderItem from "@/components/header/HeaderItem.vue";
import VisiSvg from "@/assets/icon/VisiSvg.vue";
import MisiSvg from "@/assets/icon/MisiSvg.vue";
import TujuanSvg from "@/assets/icon/TujuanSvg.vue";
import FungsiSvg from "@/assets/icon/FungsiSvg.vue";

export default {
  components: {
    HeaderItem,
    VisiSvg,
    MisiSvg,
    TujuanSvg,
    FungsiSvg
  },
  setup() {
    return {
      timer: null
    };
  },
  data() {
    return {
      isDocOnTop: true,
      isDoc01OnTop: true,
      isDoc03OnTop: true,
      isPreviewOpen: false,
      previewImage: '',
      history: "IOM-ITB merupakan perkumpulan Orang Tua Mahasiswa ITB yang menjadi salah satu mitra Institut Teknologi Bandung.\n\nBerdiri sejak tanggal 14 Juli 1968, dan digagas oleh istri-istri dosen ITB atas dasar kepedulian terhadap kondisi mahasiswa yang terkendala biaya dalam melaksanakan studinya selama perkuliahan berlangsung.\n\nDISAHKAN SEBAGAI BADAN HUKUM : Pada tanggal 16 Desember 1974 berdasarkan: \nSurat Keputusan Pengadilan Negeri Kelas I Bandung \nNo: 1/1974/PBH/Bdg.\n\n",
      functionality: "IOM ITB berfungsi sebagai mitra ITB, khususnya dalam pembinaan kelangsungan pendidikan yang bersifat sosial dan kekeluargaan.",
      goals: "IOM ITB bermaksud dan bertujuan ikut serta membina mahasiswa, dengan menjalin hubungan antar sesama orang tua mahasiswa, menghimpun dan menyalurkan daya dan usaha.",
    };
  },
  computed: {},
  mounted() {
    this.timer = setInterval(() => {
      this.isDocOnTop = !this.isDocOnTop;
      this.isDoc01OnTop = !this.isDoc01OnTop;
      this.isDoc03OnTop = !this.isDoc03OnTop;
    }, 5000);
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    openPreview(imagePath) {
      this.previewImage = imagePath;
      this.isPreviewOpen = true;
      document.body.style.overflow = 'hidden';
    },
    closePreview() {
      this.isPreviewOpen = false;
      document.body.style.overflow = 'auto';
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.blue {
  border-color: #003A6E;
}
</style>
