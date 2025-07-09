function Gallery() {
  const images = [
    "./src/assets/Imagenes/productos/glory-crunchy.png",
    "./src/assets/Imagenes/productos/glory-tentation.png",
    "./src/assets/Imagenes/productos/mushroom-burger.png",
  ];

  return (
    <section className='galeria'
      style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: "20px",
        padding: "10px"
      }}
    >
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Producto ${index + 1}`}
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
        />
      ))}
    </section>
  );
}

export default Gallery;
