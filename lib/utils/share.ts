// SNSでシェアするための関数
export function shareToSocial(platform: 'twitter' | 'facebook' | 'line' | 'instagram', data: {
  title?: string;
  text: string;
  url: string;
}) {
  const { title, text, url } = data;
  let shareUrl = '';
  
  switch (platform) {
    case 'twitter':
      // Xでシェア
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      break;
    
    case 'facebook':
      // Facebookでシェア
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
      break;
    
    case 'line':
      // LINEでシェア
      shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      break;
    
    case 'instagram':
      // Instagramはディープリンクをサポートしていないため、クリップボードにコピー
      copyToClipboard(`${text} ${url}`);
      alert('テキストをコピーしました。Instagramアプリに貼り付けてください。');
      return;
  }
  
  // 新しいウィンドウでシェアリンクを開く
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=600');
  }
}

// クリップボードにコピーする関数
function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .catch(err => {
        console.error('クリップボードへのコピーに失敗しました:', err);
      });
  } else {
    // 古いブラウザ向けのフォールバック
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('クリップボードへのコピーに失敗しました:', err);
    }
    document.body.removeChild(textArea);
  }
}
