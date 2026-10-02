let count=0;
export async function GET(){return Response.json({count});}
export async function POST(){count+=1;return Response.json({count});}
