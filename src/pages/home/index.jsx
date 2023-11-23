import useToast from '@/hooks/useToast';
import { musicAdminService } from '@/service';
import utils from '@/utils';
import { useEffect, useState } from 'react';

function Home() {
  const { openToast } = useToast();
  const [testData, setTestData] = useState([]);

  const onClick = () => {
    openToast('New message arrived.');
  };

  // useEffect(() => {
  //   musicAdminService.get('/test').then((res) => {
  //     setTestData(res.data);
  //   });
  // }, []);
  return <>
    {/* <button className="btn" onClick={onClick}>Button</button> */}
    {/* {
      testData.map((item, index) => {
        return <div key={index}>
          {
            item.rule === 1 && <>
              <p className='num-font-rule-1'>{utils.decryptNumRule1(item.x)}</p>
              <p className='num-font-rule-1'>{utils.decryptNumRule1(item.y)}</p>
            </>
          }
          {
            item.rule === 2 && <>
              <p className='num-font-rule-2' dangerouslySetInnerHTML={{
                __html: utils.decryptNumRule2(item.x),
              }} />
              <p className='num-font-rule-2' dangerouslySetInnerHTML={{
                __html: utils.decryptNumRule2(item.y),
              }} />
            </>
          }
          <br />
        </div>;
      })
    } */}
  </>;
}

export default Home;