function stdNormCDF(x)
{
  var probability = 0;
  // avoid divergence in the series which happens around +/-8 when summing the
  // first 100 terms
  if(x >= 8)
  {
    probability = 1;
  }
  else if(x <= -8)
  {
    probability = 0;
  }
  else
  {
    for(var i = 0; i < 100; i++)
    {
      probability += (Math.pow(x, 2*i+1)/_doubleFactorial(2*i+1));
    }
    probability *= Math.pow(Math.E, -0.5*Math.pow(x, 2));
    probability /= Math.sqrt(2*Math.PI);
    probability += 0.5;
  }
  return probability;
}

function _doubleFactorial(n)
{
  var val = 1;
  for(var i = n; i > 1; i-=2)
  {
    val *= i;
  }
  return val;
}


function blackScholes(s, k, t, v, r, callPut)
{
  var price = null;
  var w = (r * t + Math.pow(v, 2) * t / 2 - Math.log(k / s)) / (v * Math.sqrt(t));
  if(callPut === "call")
  {
    price = s * stdNormCDF(w) - k * Math.pow(Math.E, -1 * r * t) * stdNormCDF(w - v * Math.sqrt(t));
  }
  else // put
  {
    price = k * Math.pow(Math.E, -1 * r * t) * stdNormCDF(v * Math.sqrt(t) - w) - s * stdNormCDF(-w);
  }
  return price;
}


function getW(s, k, t, v, r)
{
  var w = (r * t + Math.pow(v, 2) * t / 2 - Math.log(k / s)) / (v * Math.sqrt(t));
  return w;
}

function getImpliedVolatility(expectedCost, s, k, t, r, callPut, estimate)
{
  estimate = estimate || .1;
  var low = 0;
  var high = Infinity;
  // perform 100 iterations max
  for(var i = 0; i < 100; i++)
  {
    var actualCost = blackScholes(s, k, t, estimate, r, callPut);
    // compare the price down to the cent
    if(expectedCost * 100 == Math.floor(actualCost * 100))
    {
      break;
    }
    else if(actualCost > expectedCost)
    {
      high = estimate;
      estimate = (estimate - low) / 2 + low
    }
    else
    {
      low = estimate;
      estimate = (high - estimate) / 2 + estimate;
      if(!isFinite(estimate)) estimate = low * 2;
    }
  }
  return estimate;
}