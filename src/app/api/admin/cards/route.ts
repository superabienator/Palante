import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ReignsCardSchema } from '@/types/story';

const DECK_PATH = path.join(process.cwd(), 'src', 'content', 'reignsDeck.json');
const PENDING_PATH = path.join(process.cwd(), 'src', 'content', 'pendingNewsCards.json');

export async function GET() {
  try {
    const deckRaw = await fs.readFile(DECK_PATH, 'utf-8');
    const deckData = JSON.parse(deckRaw);

    let pendingData = [];
    try {
      const pendingRaw = await fs.readFile(PENDING_PATH, 'utf-8');
      pendingData = JSON.parse(pendingRaw);
    } catch {
      pendingData = [];
    }

    return NextResponse.json({
      success: true,
      activeCards: deckData.cards || [],
      pendingCards: pendingData,
      totalActive: deckData.cards?.length || 0,
      totalPending: pendingData.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action || 'add';

    const deckRaw = await fs.readFile(DECK_PATH, 'utf-8');
    const deckData = JSON.parse(deckRaw);

    let pendingRaw = '[]';
    try {
      pendingRaw = await fs.readFile(PENDING_PATH, 'utf-8');
    } catch {
      pendingRaw = '[]';
    }
    let pendingCards = JSON.parse(pendingRaw);

    if (action === 'approve_pending') {
      const { cardId } = body;
      const targetCard = pendingCards.find((c: { id: string }) => c.id === cardId);
      if (!targetCard) {
        return NextResponse.json(
          { success: false, error: 'Tarjeta pendiente no encontrada' },
          { status: 404 }
        );
      }

      // Validar esquema
      const validatedCard = ReignsCardSchema.parse(targetCard);

      // Añadir al mazo si no existe ya
      if (!deckData.cards.some((c: { id: string }) => c.id === validatedCard.id)) {
        deckData.cards.push(validatedCard);
        await fs.writeFile(DECK_PATH, JSON.stringify(deckData, null, 2), 'utf-8');
      }

      // Quitar de pendientes
      pendingCards = pendingCards.filter((c: { id: string }) => c.id !== cardId);
      await fs.writeFile(PENDING_PATH, JSON.stringify(pendingCards, null, 2), 'utf-8');

      return NextResponse.json({
        success: true,
        message: 'Tarjeta aprobada e incorporada al mazo de juego con éxito',
        card: validatedCard,
      });
    }

    if (action === 'discard_pending') {
      const { cardId } = body;
      pendingCards = pendingCards.filter((c: { id: string }) => c.id !== cardId);
      await fs.writeFile(PENDING_PATH, JSON.stringify(pendingCards, null, 2), 'utf-8');

      return NextResponse.json({
        success: true,
        message: 'Tarjeta descartada de la bandeja de entrada',
      });
    }

    if (action === 'create_card') {
      const { card } = body;
      const validatedCard = ReignsCardSchema.parse(card);

      if (deckData.cards.some((c: { id: string }) => c.id === validatedCard.id)) {
        return NextResponse.json(
          { success: false, error: 'Ya existe una tarjeta con este ID en el mazo' },
          { status: 400 }
        );
      }

      deckData.cards.push(validatedCard);
      await fs.writeFile(DECK_PATH, JSON.stringify(deckData, null, 2), 'utf-8');

      return NextResponse.json({
        success: true,
        message: 'Tarjeta creada e incorporada al mazo con éxito',
        card: validatedCard,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Acción no reconocida' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
