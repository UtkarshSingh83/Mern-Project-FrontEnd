function Footer() {
    return (
        <div className="footer" style={{
  background: 'var(--color-primary)',
  color: '#fff',
  padding: '1.5rem 0',
  textAlign: 'center',
  marginTop: '2rem',
  borderTopLeftRadius: '1rem',
  borderTopRightRadius: '1rem',
  minHeight: '56px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
  <div className="container text-center">
    <span>All rights reserved. Affiliate++ &copy; {new Date().getFullYear()}</span>
  </div>
</div>
    );
}

export default Footer;