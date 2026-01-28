import Hero from '@/components/Hero';
import GiftList from '@/components/GiftList';
import MessageForm from '@/components/MessageForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-vintage-pink selection:bg-vintage-blush/30 selection:text-vintage-sepia">
      <Hero />

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-24">

        {/* Decorative Quote */}
        <section className="text-center space-y-6 max-w-2xl mx-auto">
          <p className="text-lg md:text-xl font-vintage-serif text-vintage-sepia italic leading-relaxed">
            "Nuestra bebé es la bendición más grande, es el regalo del cielo más precioso que Dios nos ha entregado para cuidarla y amarla."
          </p>
          <div className="w-16 h-px bg-vintage-sepia/30 mx-auto"></div>
        </section>

        {/* Gifts Section */}
        <section id="gifts" className="scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-vintage-serif text-vintage-sepia mb-4 uppercase tracking-vintage">Lista de Regalos</h2>
            <p className="text-vintage-sepia/80 font-vintage-serif max-w-2xl mx-auto">
              Estos son algunos detalles que nos gustarían para Maria Franchesca.
            </p>
          </div>
          <GiftList />
        </section>

        {/* Messages Section */}
        <section id="messages" className="scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-vintage-serif text-vintage-sepia mb-4 uppercase tracking-vintage">Mensajes de Cariño</h2>
            <p className="text-vintage-sepia/80 font-vintage-serif">
              Déjanos tus buenos deseos para Maria Franchesca
            </p>
          </div>
          <MessageForm />
        </section>

        {/* Info Cards - Dress Code & Location */}
        <section id="info" className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Dress Code Card */}
            <div className="bg-vintage-cream rounded-none p-8 shadow-sm border border-vintage-sage/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-vintage-ivory rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-2xl">👗</span>
                </div>
                <h3 className="text-xl font-vintage-serif text-vintage-sepia uppercase tracking-wide">Código de Vestimenta</h3>
              </div>
              <p className="text-vintage-sepia/90 leading-relaxed font-vintage-serif">
                <span className="font-semibold text-vintage-dusty-pink">Tonos pasteles</span>
                <br />
                Queremos que te sientas cómodo y guapo para las fotos. ¡Viste tus mejores colores pasteles!
              </p>
            </div>

            {/* Location Card */}
            <div className="bg-vintage-cream rounded-none p-8 shadow-sm border border-vintage-sage/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-vintage-ivory rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-xl font-vintage-serif text-vintage-sepia uppercase tracking-wide">Ubicación</h3>
              </div>
              <p className="text-vintage-sepia/90 leading-relaxed mb-4 font-vintage-serif">
                <span className="font-semibold text-vintage-dusty-pink">Metropolitan Club</span>
                <br />
                Haz clic en el botón para ver el mapa y cómo llegar.
              </p>
              <a
                href="https://www.google.com/maps/place/Metropolitan+Club/@4.655542,-74.0491041,17z/data=!3m1!4b1!4m6!3m5!1s0x8e3f9a6f4263d69d:0x293372fe71755c24!8m2!3d4.6555367!4d-74.0465292!16s%2Fg%2F1tfjxb82?entry=ttu&g_ep=EgoyMDI2MDEyNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2 border border-vintage-sepia/30 text-vintage-sepia hover:bg-vintage-sepia/5 transition-colors text-xs uppercase tracking-wide font-vintage-serif"
              >
                Ver en Google Maps
              </a>
            </div>
          </div>
        </section>

      </div>

      <footer className="py-12 text-center text-vintage-sepia/60 text-sm bg-vintage-cream border-t border-vintage-sepia/10 mt-20">
        <p className="font-vintage-serif">Hecho con ❤️ para Maria Franchesca</p>
        <p className="mt-2 text-xs font-vintage-serif">© 2026 Baby Shower Invitation</p>
      </footer>
    </main>
  );
}
