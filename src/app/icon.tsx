import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'white',
                borderRadius: '50%',
                border: '3px solid black',
                fontSize: '20px',
                fontWeight: 900,
                fontFamily: 'sans-serif',
                color: 'black',
                lineHeight: 1,
                paddingTop: '2px', // Optical alignment
            }}
        >
            L
        </div>
        ,
        {
            ...size,
        }
    );
}
