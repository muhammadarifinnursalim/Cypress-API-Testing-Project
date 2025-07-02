describe('Tes Fungsionalitas Halaman bikinlapak Clone', () => {

  beforeEach(() => {
    cy.visit('/bukalapak-clone.html');
  });

  context('Verifikasi Elemen Halaman', () => {

    it('HEADER - seharusnya menampilkan logo, search bar, dan tombol-tombol utama', () => {
      cy.log('Memverifikasi elemen di dalam header...');

      // DIUBAH: Cek logo 'bikinlapak'
      cy.get('header').contains('a', 'bikinlapak').should('be.visible');

      // DIUBAH: Cek placeholder search bar
      cy.get('header input[placeholder="Cari di Bikinlapak"]').should('be.visible');

      cy.get('header ion-icon[name="cart-outline"]').should('be.visible');
      cy.get('header button').contains('Login').should('be.visible');
      cy.get('header button').contains('Daftar').should('be.visible');
    });

    it('MAIN CONTENT - seharusnya menampilkan banner, kategori, dan judul produk', () => {
      cy.log('Memverifikasi elemen di konten utama...');

      cy.get('main img[alt="Promo Banner"]').should('be.visible');
      cy.get('main h2').contains('Kategori Pilihan').should('be.visible');
      cy.get('main').contains('span', 'Pulsa & Data').should('be.visible');
      cy.get('main h2').contains('Rekomendasi Untukmu').should('be.visible');
    });

  });

  context('Verifikasi Fungsionalitas JavaScript', () => {
    
    it('PRODUCT GRID - seharusnya me-render 10 kartu produk dari data dummy', () => {
      cy.log('Memverifikasi jumlah produk yang di-render...');
      cy.get('#product-grid').find('> div').should('have.length', 10);
    });

    it('PRODUCT CARD - seharusnya menampilkan detail yang benar pada kartu produk pertama', () => {
      cy.log('Memverifikasi konten di kartu produk pertama...');
      cy.get('#product-grid > div').first().as('firstCard');

      // DIUBAH: Verifikasi nama produk dan harga sesuai data baru
      cy.get('@firstCard').find('h3').should('contain.text', 'iPhone 15 Pro');
      cy.get('@firstCard').find('p').should('contain.text', 'Rp18.499.000');
      cy.get('@firstCard').find('span').contains('Jakarta').should('be.visible');
    });

  });

});