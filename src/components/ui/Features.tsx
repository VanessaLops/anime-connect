'use client';

export default function Features() {
  return (
    <section className="px-6 md:px-20 py-16 bg-black">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Funcionalidades</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#111] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Chats em tempo real</h3>
          <p className="text-gray-400">Converse com outros otakus.</p>
        </div>
        <div className="bg-[#111] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Ranking de personagens</h3>
          <p className="text-gray-400">Vote nos seus personagens favoritos.</p>
        </div>
        <div className="bg-[#111] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Eventos e lives</h3>
          <p className="text-gray-400">Participe de lives e eventos otaku.</p>
        </div>
      </div>
    </section>
  );
}
