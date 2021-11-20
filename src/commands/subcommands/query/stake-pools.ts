import { Subcommand } from '../subcommand';

// cardano-cli response
// pool1qqyjr9pcrv97gwrueunug829fs5znw6p2wxft3fvqkgu5f4qlrg
// pool1qqfnw2fwajdnam7xsqhhrje5cgd8jcltzfrx655rd23eqlxjfef
// pool1qquwwu6680fr72y4779r2kpc7mxtch8rp2uhuqcc7v9p6q4f7ph
// pool1qptl80vq84xm28pt3t2lhpfzqag28csjhktxz5k6a74n260clmt
// pool1qzlk4mdgauljhk9eq4m6jmxtjyyeyjgjj0wk7vfmvwxrx22ljgs
// pool1qrfa3jrqptfj0kg5pef7fup6ta70pdf7e7vjcgpxtrtsvxxf7ze
// pool1qrazx9r2jtepdefa7h830az933vexudt9rpn0t2vky95k5k97my
// pool1qy2fm6lxgaxltgvylq955vfz6md9njs42ghld9l0ekr6uf8fr07
// pool1q9ss9dxccvlh5289evsp63f5qxhn0d30kpvcpufeh9q37ua5nhu
// pool1q9n8adj6d8wzf69smatx0dnwmlj2lkrgnl28p0pu8fkl5rg4e2l
// pool1q8we0kpchnqkgnxypudv0jc08mdzcx6k748a3mtceku3c9434xw
// pool1qgh2hsuwtwpff5lvspyfrl2lkth4jvpdm3trfp7qvm22guzl8kc
// pool1qfyqv9s5nz3y2j9xezk0l3m0ss3fff68yxsnltgu3wtes7mdjrs
// pool1qf7aaelmav0w2t9rdhl9ukf0eg6p9pa00gfk8wqxh3dmj253kpw
// pool1q0fyxxrkqn2nly6k7llj859gaxuzrnlvqgdu9z8c5g2mw33mt7l
// pool1q0j79rr7a7pl4n07pk7au08e3yq2tdc7sjdu27d407j2g4z7gen
// pool1q0umnwuvj6menpj49z64fr4hf2z7qwnme28c87tyss7zc7y3c5e
// pool1qsk7fjjum8epms73qnwtcyknx3judv8pjvegaqrjxq7sy3jql4c
// pool1qjgxukyy69a5xhne2ah94eg908d9xtts4l2agah3mplxz5mghds
// pool1qjgjxwfft3rtcws7jmu4w45wuvw4nszef5ha8ww6rz8fcku85ql
// pool1qkqjpm5gcvc5v9d3zypx3k2czdv2d6ppak07cy80dvfuzz73srr
// pool1qe2xp6946xefvrncclmgyu665jgw5q3rd8e2cwc8t03xk6u5dux
// ...

export class StakePools extends Subcommand {
  prettyPrint = (data: string[]) => {
    data.forEach(pool => this.log(pool))
  }

  doWork = async () => {
    const response = await this.client.poolsAll();
    return response;
  };
}
