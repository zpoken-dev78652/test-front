export async function getServerSideProps({ req, res }) {
  res.setHeader("Content-Type", "application/json");
  res.write(
    JSON.stringify([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.chronicleapp.chronicle",
          sha256_cert_fingerprints: [
            "1E:14:2B:6A:1B:11:2A:53:D7:0B:E6:E3:D5:3E:54:93:DF:42:76:5C:76:30:6A:04:63:FB:F0:B9:A7:5A:5E:F3",
            "1F:F9:D8:E9:B2:AF:17:81:5A:18:FC:C6:76:F9:A8:77:21:5D:76:6D:97:E4:49:34:68:2B:E5:30:1A:6C:80:2E",
          ],
        },
      },
    ])
  );
  res.end();
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default function assetlinksPage() {
  return <></>;
}
