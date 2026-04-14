import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST( request: NextRequest ) {
  const token = request.headers.get( 'x-revalidate-token' );

  if ( ! token || token !== process.env.REVALIDATE_SECRET ) {
    return NextResponse.json( { error: 'Unauthorized' }, { status: 401 } );
  }

  const body     = await request.json().catch( () => ({}) );
  const paths    = Array.isArray( body.paths ) ? body.paths : [ '/locations' ];

  for ( const path of paths ) {
    revalidatePath( path );
  }

  return NextResponse.json( { revalidated: true, paths } );
}
