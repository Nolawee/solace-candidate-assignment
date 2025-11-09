export interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}

interface AdvocateCardProps {
  advocate: Advocate;
}

export default function AdvocateCard({ advocate }: AdvocateCardProps) {
  return (
    <article className="advocate-card">
      <div className="picture">
        <svg className="profile-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <title>Profile</title>
          <g id="Profile">
            <g id="Profile-2" data-name="Profile">
              <path fill="#347866" d="M256,73.8247a182.1753,182.1753,0,1,0,182.18,182.18A182.1767,182.1767,0,0,0,256,73.8247Zm0,71.8335a55.05,55.05,0,1,1-55.0538,55.0458A55.0458,55.0458,0,0,1,256,145.6582Zm.5193,208.7226H175.6682c0-54.2547,29.5218-73.5732,48.8845-90.9054a65.68,65.68,0,0,0,62.8856,0c19.3626,17.3322,48.8844,36.6507,48.8844,90.9054Z"/>
            </g>
          </g>
        </svg>
      </div>
      
      <div className="name-details">
        <h2 className="advocate-name">{advocate.firstName} {advocate.lastName}</h2>
        
        <div className="details">
          <div className="detail-item">
            <svg aria-hidden="true" className="detail-icon" data-block="true" fill="#666" width="24" height="24" viewBox="0 0 24 24">
              <path d="M4 11.3333L0 9L12 2L24 9V17.5H22V10.1667L20 11.3333V18.0113L19.7774 18.2864C17.9457 20.5499 15.1418 22 12 22C8.85817 22 6.05429 20.5499 4.22263 18.2864L4 18.0113V11.3333ZM6 12.5V17.2917C7.46721 18.954 9.61112 20 12 20C14.3889 20 16.5328 18.954 18 17.2917V12.5L12 16L6 12.5ZM3.96927 9L12 13.6846L20.0307 9L12 4.31541L3.96927 9Z" />
            </svg>
            <span>{advocate.degree.toUpperCase()}</span>
          </div>
          
          <div className="detail-item">
            <svg aria-hidden="true" className="detail-icon" data-block="true" fill="#666" width="24" height="24" viewBox="0 0 24 24">
            <path d="M18.3643 10.9792C19.9264 12.5413 19.9264 15.0739 18.3643 16.636L12.7075 22.2929C12.317 22.6834 11.6838 22.6834 11.2933 22.2929L5.63642 16.636C4.07432 15.0739 4.07432 12.5413 5.63642 10.9792C7.19851 9.41709 9.73117 9.41709 11.2933 10.9792L11.9997 11.6856L12.7075 10.9792C14.2696 9.41709 16.8022 9.41709 18.3643 10.9792ZM7.05063 12.3934C6.26958 13.1744 6.26958 14.4408 7.05063 15.2218L12.0004 20.1716L16.9501 15.2218C17.7312 14.4408 17.7312 13.1744 16.9501 12.3934C16.1691 11.6123 14.9027 11.6123 14.1203 12.3948L11.9983 14.5126L9.87906 12.3934C9.09801 11.6123 7.83168 11.6123 7.05063 12.3934ZM12.0004 1C14.2095 1 16.0004 2.79086 16.0004 5C16.0004 7.20914 14.2095 9 12.0004 9C9.79124 9 8.00038 7.20914 8.00038 5C8.00038 2.79086 9.79124 1 12.0004 1ZM12.0004 3C10.8958 3 10.0004 3.89543 10.0004 5C10.0004 6.10457 10.8958 7 12.0004 7C13.1049 7 14.0004 6.10457 14.0004 5C14.0004 3.89543 13.1049 3 12.0004 3Z"></path>
            </svg>
            <span>{advocate.yearsOfExperience} years experience</span>
          </div>
          
          <div className="detail-item">
            <svg aria-hidden="true" className="detail-icon" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#666" d="M0.00395042 2.01066C0.00231692 0.901951 0.901917 0.00266197 2.01062 0.00462392C7.3404 0.0140554 12.6702 0.00307674 18 0.000511352C19.1046 -2.03087e-05 20 0.895426 19.9995 1.99999C19.9974 6.66305 19.9891 11.3262 19.996 15.9892C19.9977 17.098 19.098 17.9973 17.9892 17.9953C12.6598 17.9853 7.33027 17.9951 2.0008 17.9989C0.895894 17.9997 -1.59547e-05 17.104 0.000537849 15.9991C0.00287496 11.3363 0.0108203 6.67348 0.00395042 2.01066ZM1.99999 2V16H18V2H1.99999ZM3.99999 5C3.99999 4.44772 4.4477 4 4.99999 4H8.99999C9.55227 4 9.99999 4.44772 9.99999 5V9C9.99999 9.55229 9.55227 10 8.99999 10H4.99999C4.4477 10 3.99999 9.55229 3.99999 9V5ZM5.99999 6V8H7.99999V6H5.99999ZM3.99999 13C3.99999 12.4477 4.4477 12 4.99999 12H15C15.5523 12 16 12.4477 16 13C16 13.5523 15.5523 14 15 14H4.99999C4.4477 14 3.99999 13.5523 3.99999 13ZM12 5C12 4.44772 12.4477 4 13 4H15C15.5523 4 16 4.44772 16 5C16 5.55229 15.5523 6 15 6H13C12.4477 6 12 5.55229 12 5ZM12 9C12 8.44772 12.4477 8 13 8H15C15.5523 8 16 8.44772 16 9C16 9.55229 15.5523 10 15 10H13C12.4477 10 12 9.55229 12 9Z" />
            </svg>
            <span>{advocate.city}</span>
          </div>
        </div>
        
        <div className="detail-item" style={{ fontSize: "1.1em", marginTop: "12px" }}>
          <svg aria-hidden="true" className="detail-icon" data-block="true" fill="#666" width="24" height="24" viewBox="0 0 24 24">
            <path d="M16 2C16.5523 2 17 2.44772 17 3V4H20C20.552 4 21 4.448 21 5V21C21 21.552 20.552 22 20 22H4C3.448 22 3 21.552 3 21V5C3 4.448 3.448 4 4 4H7V3C7 2.44772 7.44772 2 8 2H16ZM7 6H5V20H19V6H17V7C17 7.55228 16.5523 8 16 8H8C7.44772 8 7 7.55228 7 7V6ZM12 11C12.5523 11 13 11.4477 13 12V13H14C14.5523 13 15 13.4477 15 14C15 14.5523 14.5523 15 14 15H12.999L12.9995 15.9995C12.9998 16.552 12.552 17 11.9995 17C11.4474 17 10.9998 16.5526 10.9995 16.0005L10.999 15H10C9.44771 15 9 14.5523 9 14C9 13.4477 9.44772 13 10 13H11V12C11 11.4477 11.4477 11 12 11ZM15 4H9V6H15V4Z"></path>
          </svg>
          <span style={{ fontWeight: "600" }}>Specialities:</span>
        </div>
        <div className="specialties-list">
          {advocate.specialties.map((specialty, sIndex) => (
            <span key={sIndex}>
              <span className="specialty-item">{specialty}</span>
              {sIndex < advocate.specialties.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>
      
      <div className="buttons">
        <button className="btn-primary" onClick={() => window.location.href = `tel:+1${advocate.phoneNumber}`}>
          Call {advocate.firstName}
        </button>
      </div>
    </article>
  );
}

