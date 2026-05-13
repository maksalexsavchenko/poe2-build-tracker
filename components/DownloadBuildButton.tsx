'use client';
import { Guide } from '@/lib/types';

interface Props {
  guide: Guide;
}

export default function DownloadBuildButton({ guide }: Props) {
  const handleDownload = async () => {
    const { generateBuildCode } = await import('@/lib/build-generator');
    const code = generateBuildCode(guide);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${guide.id}.build`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-opacity hover:opacity-90 text-sm"
      style={{ background: 'var(--gold)', color: '#0d0d0f' }}
    >
      ⬇ Скачати .build
    </button>
  );
}
