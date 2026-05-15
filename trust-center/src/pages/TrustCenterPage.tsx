import { useSearchParams } from 'react-router-dom';
import TrustCenterContent from '../components/TrustCenter/TrustCenterContent';

export default function TrustCenterPage() {
  const [searchParams] = useSearchParams();
  const draftPreviewFullPage = searchParams.get('draftPreview') === '1';
  const publishedPreviewFullPage = searchParams.get('publishedPreview') === '1';

  return (
    <TrustCenterContent
      standalone
      draftPreviewFullPage={draftPreviewFullPage}
      publishedPreviewFullPage={publishedPreviewFullPage}
    />
  );
}
